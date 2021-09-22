import axios from "axios";
import config from "config";
import WebSocket from "ws";
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
  SwitchStatusPaylaod,
  Worker,
  WorkerStatusPayload
} from "../shared/types";
import { isSocketMessage, messageIsFrom } from "../shared/type-guards";

interface CustomSocket extends WebSocket {
  id: string;
  devices: Set<string>;
}

const apiUrl = process.env.API_URL || "";
const HTTP = axios.create({ baseURL: apiUrl });

export class HerbertSocket {
  private static instance: HerbertSocket;
  private wss: WebSocket.Server;
  private limit = (config.get("reporting-period") as number) * 1000;

  constructor(wss: WebSocket.Server) {
    HerbertSocket.instance = HerbertSocket.instance || this;
    if (HerbertSocket.instance.wss) {
      HerbertSocket.instance.wss.close();
    }
    HerbertSocket.instance.wss = wss;
    return HerbertSocket.instance;
  }

  public listen() {
    this.wss.on("connection", this.onConnection);
  }

  public broadcastAll(msg: AnySocketMessage) {
    this.wss.clients.forEach(c => {
      if (c.readyState === WebSocket.OPEN) {
        this.send(c, msg);
      }
    });
  }

  public broadcastAllExcept(msg: AnySocketMessage, ...exceptions: WebSocket[]) {
    this.wss.clients.forEach(client => {
      for (const ws of exceptions) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          this.send(client, msg);
        }
      }
    });
  }

  public sendByDeviceID(deviceID: string, msg: AnySocketMessage) {
    this.wss.clients.forEach(c => {
      if ((c as CustomSocket).devices.has(deviceID.toLowerCase())) {
        c.send(JSON.stringify(msg));
      }
    });
  }

  public sendToWorker(workerID: string, msg: AnySocketMessage) {
    this.wss.clients.forEach(c => {
      if ((c as CustomSocket).id === workerID.toLowerCase()) {
        c.send(JSON.stringify(msg));
      }
    });
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
      config: JSON.stringify(worker.config),
      timestamp: new Date().toString()
    });

    this.sendToWorker(id, msg);
  }

  private readonly onConnection = (ws: WebSocket) => {
    console.log("websocket connection open");
    (ws as CustomSocket).id = "";
    (ws as CustomSocket).devices = new Set<string>();
    const onMessage = this.getOnMessageFunc(ws);
    ws.on("message", onMessage);
  };

  private readonly getOnMessageFunc = (ws: WebSocket) => {
    return (msg: string) => {
      let data: object;
      try {
        data = JSON.parse(msg);
      } catch (e) {
        console.error(e.message);
        this.sendError(ws, e.message);
        return;
      }

      if (!isSocketMessage(data)) {
        this.sendError(ws, "Message must specify type & payload.");
        return;
      }

      this.processMessage(ws, data);
      this.broadcastAllExcept(data, ws);
    };
  };

  private sendError(ws: WebSocket, message: string) {
    const messageObject = makeErrorMessage({
      message,
      timestamp: new Date().toString()
    });

    this.send(ws, messageObject);
  }

  private send(ws: WebSocket, message: AnySocketMessage) {
    ws.send(JSON.stringify(message));
  }

  private async processMessage(ws: WebSocket, msg: AnySocketMessage) {
    if (messageIsFrom(makeMeterStatusMessage, msg)) {
      await this.handleMeterStatusMsg(ws, msg.payload);
      return;
    }

    if (messageIsFrom(makeSwitchStatusMessage, msg)) {
      await this.handleSwitchStatusMsg(ws, msg.payload);
      return;
    }

    if (messageIsFrom(makeWorkerRegisterMessage, msg)) {
      this.handleWorkerRegisterMsg(ws, msg.payload);
      return;
    }

    if (messageIsFrom(makeWorkerStatusMessage, msg)) {
      this.handleWorkerStatusMsg(ws, msg.payload);
      return;
    }

    if (messageIsFrom(makeSendWorkerConfigMessage, msg)) {
      this.sendWorkerConfig(msg.payload);
      return;
    }

    if (messageIsFrom(makeSendByDeviceIDMessage, msg)) {
      this.sendByDeviceID(msg.payload.device, msg.payload.msg);
      return;
    }

    if (messageIsFrom(makeBroadcastAllMessage, msg)) {
      this.broadcastAll(msg);
      return;
    }

    console.warn("unhandled message type", msg.type);
  }

  private async handleWorkerRegisterMsg(
    ws: WebSocket,
    payload: RegisterWorkerPayload
  ) {
    try {
      (ws as CustomSocket).id = payload.worker.toLowerCase();

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
      console.error(e.message);
    }
  }

  private async handleWorkerStatusMsg(
    ws: WebSocket,
    payload: WorkerStatusPayload
  ) {
    try {
      (ws as CustomSocket).id = payload.worker.toLowerCase();
      await HTTP.put(`/workers/${payload.worker}`);
    } catch (e) {
      console.error(e.message);
    }
  }

  private async handleSwitchStatusMsg(
    ws: WebSocket,
    payload: SwitchStatusPaylaod
  ) {
    try {
      (ws as CustomSocket).devices.add(payload.device.toLowerCase());

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
      console.error(e.message);
    }
  }

  private async handleMeterStatusMsg(
    ws: WebSocket,
    payload: MeterStatusPayload
  ) {
    try {
      (ws as CustomSocket).devices.add(payload.device.toLowerCase());

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
          pressure: payload.pressure,
          ts: payload.timestamp
        };

        await HTTP({
          method: "post",
          url: "/readings",
          data: body
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}
