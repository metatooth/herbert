import config from "config";
import http from "http";
import WebSocket from "ws";
import {
  makeConfigureMessage,
  makeErrorMessage,
  makeMeterStatusMessage,
  makeSwitchStatusMessage,
  makeWorkerRegisterMessage,
  makeWorkerStatusMessage
} from "../shared/message-creators";
import { AnySocketMessage } from "../shared/types";
import { isSocketMessage, messageIsFrom } from "../shared/util";
import {
  createReading,
  createStatus,
  readDevice,
  readMeter,
  readWorker,
  registerDevice,
  registerMeter,
  registerWorker,
  updateWorker
} from "./db";

interface CustomSocket extends WebSocket {
  id: string;
  devices: Set<string>;
}

class HerbertSocket {
  private static instance: HerbertSocket;
  private wss: WebSocket.Server;
  private initialized = false;

  constructor() {
    HerbertSocket.instance = HerbertSocket.instance || this;
    return HerbertSocket.instance;
  }

  public init(server: http.Server) {
    if (!this.initialized) {
      this.wss = new WebSocket.Server({ server });
      this.wss.on("connection", this.onConnection);
      this.initialized = true;
    }
  }

  public broadcastAll(msg: AnySocketMessage) {
    this.wss.clients.forEach(c => {
      if (c.readyState === WebSocket.OPEN) {
        this.send(c, msg);
      }
    });
  }

  public sendByDeviceID(deviceID: string, msg: AnySocketMessage) {
    this.wss.clients.forEach(c => {
      if ((c as CustomSocket).devices.has(deviceID)) {
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
    const worker = await readWorker(id);

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

  private onConnection = (ws: WebSocket) => {
    console.log("websocket connection open");
    (ws as CustomSocket).id = "";
    (ws as CustomSocket).devices = new Set<string>();
    const onMessage = this.getOnMessageFunc(ws);
    ws.on("message", onMessage);
  };

  private readonly getOnMessageFunc = (ws: WebSocket) => {
    return (msg: string) => {
      let data: any;
      try {
        data = JSON.parse(msg);
      } catch (e) {
        this.sendError(ws, e);
        return;
      }

      if (!isSocketMessage(data)) {
        this.sendError(ws, "Message must specify type & payload.");
        return;
      }

      this.processMessage(ws, data);

      // relay message to all clients
      this.wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      });
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
    const limit = (config.get("reporting-period") as number) * 1000;

    if (messageIsFrom(makeMeterStatusMessage, msg)) {
      if (msg.payload.device && msg.payload.manufacturer) {
        (ws as CustomSocket).devices.add(msg.payload.device.toLowerCase());
        await registerMeter(msg.payload.device, msg.payload.manufacturer);
        const meter = await readMeter(msg.payload.device);
        const diff =
          Date.parse(msg.payload.timestamp) - meter.timestamp.getTime();
        if (
          meter.temperature != msg.payload.temperature ||
          meter.humidity != msg.payload.humidity ||
          diff > limit
        ) {
          createReading(
            msg.payload.device,
            msg.payload.temperature,
            msg.payload.humidity,
            msg.payload.pressure,
            new Date(msg.payload.timestamp)
          );
        }
      }
      return;
    }

    if (messageIsFrom(makeSwitchStatusMessage, msg)) {
      if (msg.payload.device && msg.payload.manufacturer) {
        (ws as CustomSocket).devices.add(msg.payload.device.toLowerCase());
        await registerDevice(msg.payload.device, msg.payload.manufacturer);
        const device = await readDevice(msg.payload.device);
        const diff =
          Date.parse(msg.payload.timestamp) - device.timestamp.getTime();
        if (device.status != msg.payload.status || diff > limit) {
          createStatus(
            msg.payload.device,
            msg.payload.status,
            new Date(msg.payload.timestamp)
          );
        }
      }
      return;
    }

    if (messageIsFrom(makeWorkerRegisterMessage, msg)) {
      (ws as CustomSocket).id = msg.payload.worker.toLowerCase();
      await registerWorker(msg.payload.worker, msg.payload.inet);
      this.sendWorkerConfig(msg.payload.worker);
      return;
    }

    if (messageIsFrom(makeWorkerStatusMessage, msg)) {
      (ws as CustomSocket).id = msg.payload.worker.toLowerCase();
      await updateWorker(msg.payload.worker);
      return;
    }

    console.warn("unhandled message type", msg.type);
  }
}

export const herbertSocket = new HerbertSocket();
