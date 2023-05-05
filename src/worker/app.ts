import { io, Socket } from "socket.io-client";
import fs from "fs";
import { networkInterfaces } from "os";

import { Meter } from "./meter";
import { MockMeter } from "./mock-meter";
import { MockPlug } from "./mock-plug";
import { Switch } from "./switch";
import { Herbert } from "./herbert";
import { SequentMicrosystems } from "./sequent-microsystems";
import { MerossController } from "./meross-controller";
import { IRSend } from "./i-r-send";
import {
  AnySocketMessage,
  CommandPayload,
  SocketMessageMap,
} from "../shared/types";
import { isSocketMessage, messageIsFrom } from "../shared/type-guards";
import {
  makeCommandMessage,
  makeConfigureMessage,
  makeErrorMessage,
  makeMeterStatusMessage,
  makeSwitchStatusMessage,
  makeWorkerRegisterMessage,
  makeWorkerStatusMessage,
} from "../shared/message-creators";

import WebCamera from "./web-camera";

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
  private monitorPort = process.env.MONITOR_PORT || "";
  private closed = false;
  private channel: number;
  initialized = false;
  socket?: Socket<SocketMessageMap> = undefined;
  meters: Array<Meter> = [];
  switches: Array<Switch> = [];
  macaddr = "";
  inet = "";
  camera = "";
  meross: MerossController = undefined;
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

    /**
    thermopro = new ThermoPro();
    thermopro.scan();
    */

    return new Promise((resolve) => {
      const i = setInterval(() => {
        if (this.initialized) {
          clearInterval(i);
          return resolve();
        }
        const msg = makeWorkerRegisterMessage({
          worker: this.macaddr,
          inet: this.inet,
        });
        this.send(msg);
      }, 5000);
    });
  }

  public readonly run = async (): Promise<void> => {
    if (!this.initialized) {
      return Promise.reject("app is not initialized");
    }

    if (this.monitorPort !== "") {
      const cam = new WebCamera(this.monitorPort);
      cam
        .fetch()
        .then((image) => {
          this.camera = (image as Buffer).toString("base64");
        })
        .catch((e) => {
          console.log("ERROR", e);
        });
    }

    this.workerStatus();

    const interval: number = 1000 * (this.config.interval || 30);

    console.log(new Date(), " RUN");

    this.meters.forEach((meter) => {
      this.meterStatus(meter);
    });

    this.switches.forEach((plug) => {
      this.switchStatus(plug.status());
    });

    if (this.meross) {
      this.meross.switches.forEach((plug) => {
        if (plug.state === "") {
          plug.off();
        }
        this.switchStatus(plug.status());
      });
    }

    if (this.runTimeout) {
      clearTimeout(this.runTimeout);
      this.runTimeout = undefined;
    }

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
    this.meters = [];
    this.switches = [];

    const devices =
      this.config && this.config.devices && Array.isArray(this.config.devices)
        ? (this.config.devices as ConfigDevice[])
        : ([] as ConfigDevice[]);

    devices.forEach(async (dev) => {
      const mac = this.formatMacAddress(dev.id);
      if (dev.manufacturer === "meross") {
        const options = {
          email: dev.username,
          password: dev.password,
          logger: console.log,
          localHttpFirst: true,
        };

        this.meross = new MerossController(options);

        this.meross.on("update", (e) => {
          console.log(`got an update, ${e}`);
        });
      } else if (dev.manufacturer === "herbert") {
        if (dev.pin) {
          this.switches.push(new Herbert(mac, parseInt(dev.pin)));
        } else if (dev.board && dev.channel) {
          this.switches.push(
            new SequentMicrosystems(
              mac,
              parseInt(dev.board),
              parseInt(dev.channel)
            )
          );
        } else if (dev.remote && dev.mode) {
          this.switches.push(new IRSend(mac, dev.remote, dev.mode));
        }
      } else if (dev.manufacturer === "mockmeter") {
        const meter = new MockMeter(mac);
        this.meters.push(meter);
      } else if (dev.manufacturer === "mockplug") {
        const plug = new MockPlug(mac);
        plug.off();
        this.switches.push(plug);
      }

      this.join();
      this.initialized = true;
    });
  }

  private async createSocket() {
    if (this.socket) {
      this.stop();
    }

    console.log("TRYING TO CONNECT ", this.wsUrl);

    this.socket = io(this.wsUrl);
    this.socket.on("connect", () => {
      this.socket.emit("join", { room: "workers", workerID: this.macaddr });
    });
    this.socket.on("connect_error", this.onSocketError);
    this.socket.on("disconnect", this.onSocketClose);
    this.socket.on("message", this.handleSocketMessage);
  }

  private join = async () => {
    const all = [...this.meters, ...this.switches].map((d) => d.device);
    console.log("ALL", all);
    this.socket.emit("join", {
      room: "workers",
      workerID: this.macaddr,
      devices: all,
    });
  };

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
        console.log("IS COMMAND");
        console.log(data.payload);
        console.log("COMMAND COMMAND");
        this.updateSwitches(data.payload);
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

  private updateSwitches(data: CommandPayload) {
    console.log("App::updateSwitches", data);
    const mac = this.formatMacAddress(data.device);
    this.switches.forEach((plug) => {
      console.log(
        "checking",
        plug.device,
        this.formatMacAddress(plug.device),
        mac
      );
      if (this.formatMacAddress(plug.device) === mac) {
        const state = plug.state ? "on" : "off";
        console.log("plug state", state, data.action, plug.device);
        if (data.action === "on") {
          console.log("App::updateSwitches ON");
          plug.on();
        } else if (data.action === "off") {
          console.log("App::updateSwitches OFF");
          plug.off();
        }
      }
    });

    if (this.meross) {
      this.meross.switches.forEach((plug) => {
        if (this.formatMacAddress(plug.device) === mac) {
          const state = plug.state ? "on" : "off";
          console.log("plug state", state, data.action, plug.device);
          if (data.action === "on" && state === "off") {
            console.log("ON");
            plug.on();
          } else if (data.action === "off" && state === "on") {
            console.log("OFF");
            plug.off();
          }
        }
      });
    }
  }

  private async meterStatus(meter: Meter) {
    const msg = makeMeterStatusMessage({
      device: this.formatMacAddress(meter.device),
      type: "meter",
      manufacturer: meter.manufacturer,
      temperature: meter.clime.temperature,
      humidity: meter.clime.humidity,
      timestamp: new Date().toString(),
    });
    console.log("send this message", msg);
    this.send(msg);
  }

  private async switchStatus(switcher: Switch) {
    const msg = makeSwitchStatusMessage({
      device: this.formatMacAddress(switcher.device),
      manufacturer: switcher.manufacturer,
      status: switcher.state,
      timestamp: new Date().toString(),
    });
    console.log("SEND", msg);
    this.send(msg);
  }

  private async workerStatus() {
    const msg = makeWorkerStatusMessage({
      worker: this.macaddr,
      inet: this.inet,
      config: JSON.stringify(this.config),
      camera: this.camera,
      timestamp: new Date().toString(),
    });
    this.send(msg);
  }

  private formatMacAddress(id: string) {
    if (!id) {
      return "";
    }

    if (id.length != 12 && id.length != 17) {
      console.warn("bad format for mac address:", id);
      return "";
    }

    // Remove all but alphanumeric characters
    let mac = id.replace(/\W/gi, "").toLowerCase();

    // Append a colon after every two characters
    mac = mac.replace(/(.{2})/g, "$1:");

    // remove trailing colon
    return mac.split(":").slice(0, -1).join(":");
  }
}
