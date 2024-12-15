import { io, Socket } from "socket.io-client";
import fs from "fs";
import { networkInterfaces } from "os";

import { Meter } from "./meter";
import { MeterController } from "./meter-controller";
import { MockMeter } from "./mock-meter";
import { MockPlug } from "./mock-plug";
import { Switch } from "./switch";
import { Herbert } from "./herbert";
import { SequentMicrosystems } from "./sequent-microsystems";
import { IRSend } from "./i-r-send";
import { SwitchController } from "./switch-controller";
import { MerossController } from "./meross-controller";

import { formatMacAddress } from "../shared/utils";
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

const isMockWorker = (): boolean => {
  const envVar = process.env.NODE_ENV;
  return (
    envVar !== undefined &&
    (envVar.toLowerCase() === "docker" || envVar.toLowerCase() === "unit_test")
  );
};

interface ConfigDevice {
  id: string;
  manufacturer: string;
  username?: string;
  password?: string;
  xApiKey?: string;
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
  private config: ConfigWorker = {
    interval: 30,
    polling: 5,
    devices: [],
  };
  private wsUrl = process.env.WSS_URL || "";
  private monitorPort = process.env.MONITOR_PORT || "";
  private closed = false;
  private channel: number;
  initialized = false;
  socket?: Socket<SocketMessageMap> = undefined;
  macaddr = "";
  inet = "";
  camera = "";
  metered: MeterController = undefined;
  switched: SwitchController = undefined;
  meross: MerossController = undefined;
  heldMessages: AnySocketMessage[] = [];
  runTimeout: NodeJS.Timeout | undefined;

  public constructor() {
    App.instance = App.instance || this;
    return App.instance;
  }

  public async init(): Promise<void> {
    console.log("INIT");
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

    console.log("Create socket...");
    await this.createSocket();
    console.log("Done");

    return new Promise(async (resolve) => {
      console.log("Ready to resolve init?");
      try {
        await this.run();
      } catch (e) {
        console.log(`ERROR: caught on run - ${e}`);
      }
      console.log("Done run.");
      const i = setInterval(() => {
        console.log("Interval has been reached.");
        console.log(`Initialized yet? ${this.initialized}`);
        if (this.initialized) {
          clearInterval(i);
          return resolve();
        }
        console.log("make worker register message");
        const msg = makeWorkerRegisterMessage({
          worker: this.macaddr,
          inet: this.inet,
        });
        console.log(`Will send this - ${msg.payload.worker}`);
        this.send(msg);
      }, 5000);
    });
  }

  public readonly run = async (): Promise<void> => {
    console.log("RUN");
    if (!this.initialized) {
      return Promise.reject("app is not initialized");
    }

    console.log("past initialized check");
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

    console.log(new Date(), " RUN");

    if (!isMockWorker() && !this.metered) {
      const polling: number = 1000 * (this.config.polling || 5);
      this.metered = new MeterController({
        polling: polling,
        send: this.send,
      });
    }

    if (this.meross) {
      this.meross.switches.forEach((plug) => {
        if (plug.state === "") {
          plug.off();
        }
        this.switched.switchStatus(plug.status());
      });
    }

    if (this.runTimeout) {
      clearTimeout(this.runTimeout);
      this.runTimeout = undefined;
    }

    const interval: number = 1000 * (this.config.interval || 30);
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

  private readonly switchBotHandler = async (
    ad: WoSensorTH
  ): Promise<boolean> => {
    console.log("switchbot handler", ad.id);
    let meter = this.meters.find(el => {
      return el.device === ad.id;
    });

    if (!meter) {
      meter = new Meter(ad.id, "SwitchBot");
      this.meters.push(meter);
    }

    meter.clime.temperature = ad.serviceData.temperature.c;
    meter.clime.humidity = ad.serviceData.humidity / 100.0;
    meter.clime.timestamp = new Date();

    this.meterStatus(meter);

    return Promise.resolve(true);
  };

  private async initDevices(config) {
    console.log("= init devices config", config);
    //    const parsed = JSON.parse(config);
    //    console.log("= init devices parsed", parsed);
    //    const devices = parsed.devices;
    console.log("init devices devices", config.devices);

    this.switched = new SwitchController({
      send: this.send,
    });

    config.devices.forEach(async (dev) => {
      const mac = formatMacAddress(dev.id);
      if (dev.manufacturer === "meross") {
        const options = {
          email: dev.username,
          password: dev.password,
          logger: console.log,
          localHttpFirst: true,
        };

        console.log("init device meross", options);

        this.meross = new MerossController(options);

        this.meross.on("update", (e) => {
          console.log(`got an update, ${e}`);
        });
      } else if (dev.manufacturer === "herbert") {
        if (dev.pin) {
          this.switched.add(new Herbert(mac, parseInt(dev.pin)));
        } else if (dev.board && dev.channel) {
          this.switched.add(
            new SequentMicrosystems(
              mac,
              parseInt(dev.board),
              parseInt(dev.channel)
            )
          );
        } else if (dev.remote && dev.mode) {
          this.switched.add(new IRSend(mac, dev.remote, dev.mode));
        }
      } else if (dev.manufacturer === "mockmeter") {
        const meter = new MockMeter(mac);
        this.metered.add(meter);
      } else if (dev.manufacturer === "mockplug") {
        const plug = new MockPlug(mac);
        plug.off();
        this.switched.add(plug);
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
      console.log("DONE");
      this.socket.emit("join", { room: "workers", workerID: this.macaddr });
    });
    this.socket.on("connect_error", this.onSocketError);
    this.socket.on("disconnect", this.onSocketClose);
    this.socket.on("message", this.handleSocketMessage);
  }

  private join = async () => {
    const switched = [...this.switched.switches].map((d) => d.device);
    const meross = [...this.switched.switches].map((d) => d.device);
    const all = switched.concat(meross);
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
    console.log("REC", data);
    try {
      if (!isSocketMessage(data)) {
        console.warn("unknown message format:", data);
        return;
      }

      if (messageIsFrom(makeConfigureMessage, data)) {
        if (data.payload.worker === this.macaddr) {
          this.initDevices(data.payload.config);
        }
        return;
      }

      if (messageIsFrom(makeCommandMessage, data)) {
        this.switched.handle(data.payload);
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

  async send(data: AnySocketMessage) {
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
      timestamp: new Date().toString(),
    });
    this.send(msg);
  }
}
