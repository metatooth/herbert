import config from "config";
import http from "http";
import WebSocket from 'ws';
import {
  HerbertMessageType,
  HerbertSocketMessage,
  isHerbertSocketMessage
} from "../shared/types";
import {
  createReading,
  createStatus,
  readDevice,
  readMeter,
  readWorker,
  registerDevice,
  registerMeter,
  registerWorker
} from "./db";

class HerbertSocket {
  private static instance: HerbertSocket;
  private wss: WebSocket.Server
  private initialized = false;

  constructor() {
    HerbertSocket.instance = HerbertSocket.instance || this;
    return HerbertSocket.instance;
  }

  public init(server: http.Server) {
    if (!this.initialized) {
      this.wss =  new WebSocket.Server({ server });
      this.wss.on("connection", this.onConnection);
      this.initialized = true;
    }
  }

  public broadcastAll(msg: HerbertSocketMessage) {
    this.wss.clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) {
        this.send(c, msg);
      }
    });
  }

  public async sendWorkerConfig(id: string) {
    console.log("*** UPDATE WORKER ***");
    const worker = await readWorker(id);

    if (!worker) {
      console.warn("no worker found for id:", id);
      return;
    }

    const data: HerbertSocketMessage = {
      type: HerbertMessageType.Configure,
      payload: {
        worker: worker.worker,
        config: JSON.stringify(worker.config),
        timestamp: new Date()
      }
    };

    let ws: WebSocket;
    this.wss.clients.forEach((c) => {
      if ((c as any).id === id) {
        ws = c;
      }
    });

    if (ws) {
      this.send(ws, data);
    }
  }

  private onConnection = (ws: WebSocket) => {
    console.log('websocket connection open');
    const onMessage = this.getOnMessageFunc(ws);
    ws.on('message', onMessage);
  }

  private readonly getOnMessageFunc = (ws: WebSocket) => {
    return (msg: string) => {
      console.log("ON MESSAGE", msg);

      let data: any;
      try {
        data = JSON.parse(msg);
      } catch (e) {
        this.sendError(ws, e);
        return;
      }

      if (!isHerbertSocketMessage(data)) {
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
    }
  }

  private sendError(ws: WebSocket, message: string) {
    const messageObject: HerbertSocketMessage = {
      type: HerbertMessageType.Error,
      payload: message
    };

    this.send(ws, messageObject);
  }

  private send(ws: WebSocket, message: HerbertSocketMessage) {
    ws.send(JSON.stringify(message));
  }

  private async processMessage(ws: WebSocket, msg: HerbertSocketMessage) {
    switch (msg.type) {
      case HerbertMessageType.Status:
        if (msg.payload.device) {
          const limit = (config.get("reporting-period") as number) * 1000;
          if (msg.payload.type === "meter") {
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
                msg.payload.timestamp
              );
            }
          } else {
            await registerDevice(msg.payload.device, msg.payload.manufacturer);
            const device = await readDevice(msg.payload.device);
            const diff =
              Date.parse(msg.payload.timestamp) - device.timestamp.getTime();
            if (device.status != msg.payload.status || diff > limit) {
              createStatus(
                msg.payload.device,
                msg.payload.status,
                msg.payload.timestamp
              );
            }
          }
        }
        break;

      case HerbertMessageType.Register:
        (ws as any).id = msg.payload.worker;
        await registerWorker(
          msg.payload.worker,
          msg.payload.inet,
        );
        this.sendWorkerConfig(msg.payload.worker);
        break;
      default:
        console.warn('unknown message type', msg);
        break;
    }
  }
}

export const herbertSocket = new HerbertSocket();
