import WebSocket from "ws";
import config from "config";
import fs from "fs";
import { networkInterfaces } from "os";

import { Clime } from "../shared/clime";
import { Meter } from "../shared/meter";

import Switchbot from "node-switchbot";
import Wyze from "wyze-node";

try {
  fs.mkdirSync("./log");
} catch (e) {
  if (e.code != "EEXIST") {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

import { configure, getLogger, Logger } from "log4js";
configure("./config/log4js.json");
const logger: Logger = getLogger("app");

export class App {
  private static _instance: App;
  initialized: boolean;
  socket: WebSocket;
  meters: Map<Meter, Clime>;
  macaddr: string;
  heldMessages: Array<any>;
  wyze: any;

  private constructor() {
    console.log("process.argv", process.argv);

    if (process.argv.length > 2) {
      const arg = process.argv[2];
      console.log("arg", arg);
      if (arg.match(/^-C/)) {
        console.log("matched -C!");
      }
    }

    this.socket = null;

    this.heldMessages = [];

    const devices: Array<Device> = config.get("devices");

    devices.forEach(device => {
      logger.debug("DEVICE", device);
      if (device.type === "meter") {
        this.meters.set(new Meter(device.id), new Clime(0, 0, 0));
      }
    });

    this.initialized = false;
  }

  public async handler(ad: WoSensorTH): Promise<boolean> {
    const app = App.instance();
    let meter: Meter;
    let clime: Clime;
    app.meters.forEach((value, key) => {
      if (key.id === ad.id) {
        meter = key;
        clime = value;
      }
    });

    if (meter) {
      if (
        clime.temperature !== ad.serviceData.temperature.c ||
        clime.humidity !== ad.serviceData.humidity / 100.0
      ) {
        clime.temperature = ad.serviceData.temperature.c;
        clime.delta = 0.6;
        clime.humidity = ad.serviceData.humidity / 100.0;
        clime.timestamp = new Date();
        app.status(meter, clime);
      }
    } else {
      logger.debug(`XXX unhandled advertisement -- ${ad.id} XXX`);
      logger.debug(ad);
      app.meters.set(new Meter(ad.id), new Clime(0, 0, 0));
    }

    return true;
  }

  public static instance(): App {
    if (!App._instance) {
      App._instance = new App();
    }
    return App._instance;
  }

  public async init(): Promise<boolean> {
    logger.info("=====================================");
    logger.info("== Herbert Worker = Starting up... ==");
    logger.info("=====================================");

    console.log("network interfaces", networkInterfaces());
    let net = networkInterfaces()["wlo1"];
    console.log("wlo1", net);
    if (!net) {
      net = networkInterfaces()["wlan0"];
      console.log("wlan0", net);
    }

    this.macaddr = net[0]["mac"];

    this.register(this.macaddr, config.get("id"));

    this.meters = new Map();
    config.get("devices").forEach(async dev => {
      this.meters.set(new Meter(dev.id), new Clime(0, 0, 0));
    });

    config.get("credentials").forEach(async cred => {
      if (cred.type === "wyze") {
        const options = {
          username: cred.username,
          password: cred.password
        };

        this.wyze = new Wyze(options);
      }
    });

    this.initialized = true;

    return Promise.resolve(true);
  }

  private async send(data) {
    const app = App.instance();

    if (app.socket === null) {
      app.heldMessages.push(data);

      try {
        app.socket = await new WebSocket(config.get("ws-url"));

        app.socket.on("error", err => {
          logger.error("Caught", err);
        });

        app.socket.on("close", () => {
          logger.info("SOCKET IS CLOSED");
          app.socket = null;
        });

        app.socket.on("message", async msg => {
          const data = JSON.parse(msg);
          if (data.type === "COMMAND") {
            const mac = data.payload.device.replace(/:/g, "").toUpperCase();
            const device = await this.wyze.getDeviceByMac(mac);
            if (data.payload.action === "on") {
              this.wyze.turnOn(device);
            } else {
              this.wyze.turnOff(device);
            }
          }
        });
      } catch (e) {
        logger.error("Caught", e);
      }
    } else if (app.socket.readyState !== 1) {
      app.heldMessages.push(data);
    } else {
      console.log("Sending data", data);
      app.socket.send(JSON.stringify(data));

      app.heldMessages.forEach(msg => {
        console.log("Sending held message", msg);
        app.socket.send(JSON.stringify(msg));
      });

      app.heldMessages = [];
    }
  }

  private async status(meter: Meter, clime: Clime) {
    const data = {
      type: "STATUS",
      payload: {
        device: meter.id,
        type: "meter",
        manufacturer: meter.type,
        temperature: clime.temperature,
        humidity: clime.humidity,
        pressure: clime.vpd(),
        timestamp: new Date()
      }
    };
    this.send(data);
  }

  private async deviceStatus(device: WyzeDevice) {
    const data = {
      type: "STATUS",
      payload: {
        device: device.mac,
        manufacturer: "WYZE",
        status: device.device_params.switch_state,
        timestamp: new Date()
      }
    };
    this.send(data);
  }

  private async register(macaddr: string, nickname: string) {
    const data = {
      type: "STATUS",
      payload: {
        worker: macaddr,
        nickname: nickname,
        timestamp: new Date()
      }
    };
    this.send(data);
  }

  public async run(): Promise<boolean> {
    const app = App.instance();
    if (!app.initialized) {
      await app.init();
    }

    const polling: number = 1000 * parseInt(config.get("polling"));
    const interval: number = 1000 * parseInt(config.get("interval"));

    app.meters.forEach(async (clime, meter) => {
      logger.debug("Start scan on %s for %dms ...", meter.id, polling);
      meter.bot.onadvertisement = app.handler;
      await meter.startScan();
      await meter.wait(polling);
      await meter.stopScan();
      logger.debug("Done meter scan.");
    });

    logger.debug("Start SwitchBot scan %dms ...", polling);
    const switchbot = new Switchbot();
    switchbot.onadvertisement = app.handler;
    switchbot.startScan();
    switchbot.wait(polling);
    switchbot.stopScan();
    logger.debug("Done switchbot scan.");

    logger.debug("Check on WYZE plugs...");
    const devices = await app.wyze.getDeviceList();
    devices.forEach(async device => {
      const status = await app.wyze.getDeviceStatus(device);
      const state = await app.wyze.getDeviceState(device);
      console.log("device", device);
      console.log("status", status);
      console.log("state", state);
      app.deviceStatus(device);
    });
    logger.debug("Done.");

    setTimeout(app.run, interval);

    return Promise.resolve(true);
  }
}
