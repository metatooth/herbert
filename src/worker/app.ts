import { io, Socket } from "socket.io-client";
import fs from "fs";
import { networkInterfaces } from "os";

import { Device } from "./device";
import { DeviceFactory } from "./device-factory";
import { Switch } from "./switch";
import {
  AnySocketMessage,
  CommandPayload,
  SocketMessageMap
} from "../shared/types";
import { formatMacAddress } from "../shared/utils";
import { isSocketMessage, messageIsFrom } from "../shared/type-guards";
import {
  makeCommandMessage,
  makeConfigureMessage,
  makeErrorMessage,
  makeMeterStatusMessage,
  makeWorkerRegisterMessage,
  makeWorkerStatusMessage
} from "../shared/message-creators";

try {
  fs.mkdirSync("./log");
} catch (e) {
  if (e.code != "EEXIST") {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

interface ConfigDevice {
  id: string;
  manufacturer: string;
  username?: string;
  password?: string;
  board?: string;
  remote?: string;
  mode?: string;
  pin?: string;
  channel?: string;
}

interface ConfigWorker {
  interval: number;
  polling: number;
  devices: ConfigDevice[];
}

export class App {
  private static instance: App;
  private config: ConfigWorker;
  private wsUrl = process.env.WSS_URL || "";
  private closed = false;
  initialized = false;
  socket?: Socket<SocketMessageMap> = undefined;
  devices: Array<Device> = [];
  macaddr = "";
  inet = "";
  camera = "";
  heldMessages: AnySocketMessage[] = [];
  runTimeout: NodeJS.Timeout | undefined;

  public constructor() {
    App.instance = App.instance || this;
    return App.instance;
  }

  public async init(): Promise<void> {
    const interfaces = networkInterfaces();

    let net;
    if (interfaces["wlan0"]) {
      net = interfaces["wlan0"];
    } else if (interfaces["eth0"]) {
      net = interfaces["eth0"];
    } else if (interfaces["wlo1"]) {
      net = interfaces["wlo1"];
    } else {
      console.error("Undefined interface!");
    }

    if (net && net.length) {
      this.macaddr = net[0]["mac"];
      this.inet = net[0]["address"];
    }

    await this.createSocket();

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (this.initialized) {
          clearInterval(i);
          return resolve();
        }
        const msg = makeWorkerRegisterMessage({
          worker: this.macaddr,
          inet: this.inet
        });
        this.send(msg);
      }, 2000);
    });
  }

  public readonly run = async (): Promise<void> => {
    console.log("RUN", new Date());
    if (!this.initialized) {
      return Promise.reject("app is not initialized");
    }

    this.devices.forEach(device => {
      this.send(device.status());
    });

    if (this.runTimeout) {
      clearTimeout(this.runTimeout);
      this.runTimeout = undefined;
    }

    const interval = 1000 * (this.config.interval || 30);
    this.runTimeout = setTimeout(this.run, interval);
  };

  public stop() {
    if (this.runTimeout) {
      clearTimeout(this.runTimeout);
      this.runTimeout = undefined;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }

    this.initialized = false;
  }

  public close() {
    this.closed = true;
    this.stop();
    App.instance = undefined;
  }

  private async initDevices() {
    const factory = new DeviceFactory();
    this.config.devices.forEach(async config => {
      const device = factory.createDevice(config);
      if (device) {
        this.devices.push(device);
      }
    });

    const all = this.devices.map(d => d.device);
    this.socket.emit("join", {
      room: "workers",
      workerID: this.macaddr,
      devices: all
    });
    this.initialized = true;
  }

  private async createSocket() {
    if (this.socket) {
      this.stop();
    }

    this.socket = io(this.wsUrl);
    this.socket.on("connect", () => {
      this.socket.emit("join", { room: "workers", workerID: this.macaddr });
    });
    this.socket.on("connect_error", this.onSocketError);
    this.socket.on("disconnect", this.onSocketClose);
    this.socket.on("message", this.handleSocketMessage);
  }

  private readonly onSocketError = (err: Error) => {
    console.error(err);
  };

  private readonly onSocketClose = () => {
    console.info("Socket is closed");
    if (this.closed) {
      return;
    }
    setTimeout(this.restart, 5000);
  };

  private restart = async () => {
    this.stop();
    await this.init();
    await this.run();
  };

  private readonly handleSocketMessage = async (data: AnySocketMessage) => {
    try {
      if (!isSocketMessage(data)) {
        console.warn("unknown message format:", data);
        return;
      }

      if (messageIsFrom(makeConfigureMessage, data)) {
        if (data.payload.worker === this.macaddr) {
          this.config = JSON.parse(JSON.stringify(data.payload.config));
          this.initDevices();
        }
        return;
      }

      if (messageIsFrom(makeCommandMessage, data)) {
        const mac = formatMacAddress(data.payload.device);
        const target = this.devices.find(device => device.device === mac);
        if (target instanceof Switch) {
          if (data.payload.action === "on") {
            target.on();
          } else {
            target.off();
          }
        }
        return;
      }

      if (messageIsFrom(makeErrorMessage, data)) {
        console.error("!! ERROR !!", data.payload);
        return;
      }
    } catch (e) {
      console.error("socket message error:", e);
    }
  };

  private async send(data: AnySocketMessage) {
    if (this.socket === undefined) {
      this.heldMessages.push(data);
      return;
    }

    try {
      this.socket.emit("message", data);

      for (let i = 0; i < this.heldMessages.length; ++i) {
        if (this.socket) {
          const msg = this.heldMessages.shift();
          this.socket.emit("message", msg);
        }
      }
    } catch (e) {
      console.error("failed to send message:", e);
    }
  }

  private async workerStatus() {
    const msg = makeWorkerStatusMessage({
      worker: this.macaddr,
      inet: this.inet,
      config: JSON.stringify(this.config),
      camera: this.camera,
      timestamp: new Date().toString()
    });
    this.send(msg);
  }
}
