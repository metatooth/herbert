import axios from "axios";
import config from "config";
import IO from "socket.io";
import {
  makeBroadcastAllMessage,
  makeConfigureMessage,
  makeErrorMessage,
  makeMeterStatusMessage,
  makeSendByDeviceIDMessage,
  makeSendWorkerConfigMessage,
  makeSwitchStatusMessage,
  makeWorkerRegisterMessage,
  makeWorkerStatusMessage
} from "../shared/message-creators";
import {
  AnySocketMessage,
  Device,
  Meter,
  MeterStatusPayload,
  RegisterWorkerPayload,
  SocketMessageMap,
  SwitchStatusPaylaod,
  Worker,
  WorkerStatusPayload
} from "../shared/types";
import { isSocketMessage, messageIsFrom } from "../shared/type-guards";
import { vaporPressureDeficit } from "../shared/utils";

const apiUrl = process.env.API_URL || "";
const HTTP = axios.create({ baseURL: apiUrl });

export class HerbertSocket {
  private static instance: HerbertSocket;
  private wss: IO.Server<SocketMessageMap>;
  private limit = (config.get("reporting-period") as number) * 1000;

  constructor(wss: IO.Server<SocketMessageMap>) {
    HerbertSocket.instance = HerbertSocket.instance || this;
    if (HerbertSocket.instance.wss) {
      HerbertSocket.instance.wss.close();
    }
    HerbertSocket.instance.wss = wss;
    HerbertSocket.instance.wss.on("connection", this.onConnection);
    return HerbertSocket.instance;
  }

  public listen(port?: string) {
    try {
      if (!port) {
        throw "Must define port for socket server";
      }
      const portNumber = parseInt(port);
      if (isNaN(portNumber)) {
        throw `Invalid port: ${port}`;
      }
      this.wss.listen(portNumber);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  }

  public broadcastAll(msg: AnySocketMessage) {
    this.wss.emit("message", msg);
  }

  public broadcastToOthers(
    ws: IO.Socket<SocketMessageMap>,
    msg: AnySocketMessage
  ) {
    ws.broadcast.emit("message", msg);
  }

  public broadcastToClients(msg: AnySocketMessage) {
    this.wss.to("clients").emit("message", msg);
  }

  public sendToWorkerByDeviceID(deviceID: string, msg: AnySocketMessage) {
    this.wss.to(`devices:${deviceID}`).emit("message", msg);
  }

  public sendToWorkerID(workerID: string, msg: AnySocketMessage) {
    this.wss.to(`workers:${workerID}`).emit("message", msg);
  }

  public async sendWorkerConfig(id: string) {
    const resp = await HTTP.get<Worker>(`/workers/${id}`);
    const worker = resp.data;
    if (!worker) {
      console.warn("no worker found for id:", id);
      return;
    }

    const msg = makeConfigureMessage({
      worker: worker.worker,
      config: worker.config,
      timestamp: new Date().toString()
    });

    this.sendToWorkerID(id, msg);
  }

  private readonly onConnection = (ws: IO.Socket<SocketMessageMap>) => {
    console.log("websocket connection open");
    ws.on("join", data => {
      ws.join(data.room);
      if (data.workerID) {
        ws.join(`workers:${data.workerID}`);
      }
      if (data.devices && data.devices.length) {
        for (const deviceID of data.devices) {
          ws.join(`devices:${deviceID}`);
        }
      }
    });
    const onMessage = this.getOnMessageFunc(ws);
    ws.on("message", onMessage);
  };

  private readonly getOnMessageFunc = (ws: IO.Socket<SocketMessageMap>) => {
    return (data: AnySocketMessage) => {
      if (!isSocketMessage(data)) {
        this.sendError(ws, "Message must specify type & payload.");
        return;
      }

      this.processMessage(data);
      this.broadcastToOthers(ws, data);
    };
  };

  private sendError(ws: IO.Socket<SocketMessageMap>, message: string) {
    const messageObject = makeErrorMessage({
      message,
      timestamp: new Date().toString()
    });

    this.send(ws, messageObject);
  }

  private send(ws: IO.Socket<SocketMessageMap>, message: AnySocketMessage) {
    ws.emit("message", message);
  }

  private async processMessage(msg: AnySocketMessage) {
    if (messageIsFrom(makeMeterStatusMessage, msg)) {
      await this.handleMeterStatusMsg(msg.payload);
      return;
    }

    if (messageIsFrom(makeSwitchStatusMessage, msg)) {
      await this.handleSwitchStatusMsg(msg.payload);
      return;
    }

    if (messageIsFrom(makeWorkerRegisterMessage, msg)) {
      this.handleWorkerRegisterMsg(msg.payload);
      return;
    }

    if (messageIsFrom(makeWorkerStatusMessage, msg)) {
      this.handleWorkerStatusMsg(msg.payload);
      return;
    }

    if (messageIsFrom(makeSendWorkerConfigMessage, msg)) {
      this.sendWorkerConfig(msg.payload);
      return;
    }

    if (messageIsFrom(makeSendByDeviceIDMessage, msg)) {
      this.sendToWorkerByDeviceID(msg.payload.device, msg.payload.msg);
      return;
    }

    if (messageIsFrom(makeBroadcastAllMessage, msg)) {
      this.broadcastAll(msg.payload);
      return;
    }

    console.warn("unhandled message type", msg.type);
  }

  private async handleWorkerRegisterMsg(payload: RegisterWorkerPayload) {
    try {
      const body = {
        device: payload.worker,
        inet: payload.inet
      };

      await HTTP({
        method: "post",
        url: "/workers",
        data: body
      });

      this.sendWorkerConfig(payload.worker);
    } catch (e) {
      console.error("handle worker register", e.message);
    }
  }

  private async handleWorkerStatusMsg(payload: WorkerStatusPayload) {
    try {
      await HTTP.put(`/workers/${payload.worker}`);
    } catch (e) {
      console.error("handle worker status", e.message);
    }
  }

  private async handleSwitchStatusMsg(payload: SwitchStatusPaylaod) {
    try {
      const body = {
        device: payload.device,
        manufacturer: payload.manufacturer
      };

      await HTTP({
        method: "post",
        url: "/devices",
        data: body
      });

      const resp = await HTTP.get<Device>(`/devices/${payload.device}`);
      const device = resp.data;
      const ts = new Date(device.timestamp).getTime();
      const diff = Date.parse(payload.timestamp) - ts;

      if (device.status != payload.status || diff > this.limit) {
        const body = {
          device: payload.device,
          status: payload.status,
          ts: payload.timestamp
        };
        await HTTP({
          method: "post",
          url: "/statuses",
          data: body
        });
      }
    } catch (e) {
      console.error("handle switch status", e.message);
    }
  }

  private async handleMeterStatusMsg(payload: MeterStatusPayload) {
    try {
      const body = {
        macaddr: payload.device,
        manufacturer: payload.manufacturer
      };

      await HTTP({
        method: "post",
        url: "/meters",
        data: body
      });

      const resp = await HTTP.get<Meter>(`/meters/${payload.device}`);
      const meter = resp.data;
      const ts = new Date(meter.timestamp).getTime();
      const diff = Date.parse(payload.timestamp) - ts;

      if (
        meter.temperature != payload.temperature ||
        meter.humidity != payload.humidity ||
        diff > this.limit
      ) {
        const body = {
          meter: payload.device,
          temperature: payload.temperature,
          humidity: payload.humidity,
          pressure: vaporPressureDeficit(
            payload.temperature,
            0,
            payload.humidity
          ),
          ts: payload.timestamp
        };

        await HTTP({
          method: "post",
          url: "/readings",
          data: body
        });
      }
    } catch (e) {
      console.error("handle meter status", e.message);
    }
  }
}
