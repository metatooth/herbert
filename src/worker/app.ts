import WebSocket from "ws";
import config from "config";
import fs from "fs";
import { networkInterfaces } from "os";

import { vaporPressureDeficit } from "../shared/utils";

import { AirDirectives } from "./air-directives";
import { BlowerTimer } from "./blower-timer";
import { Clime } from "./clime";
import { ConstantVpd } from "./constant-vpd";
import { LampTimer } from "./lamp-timer";
import { Meter } from "./meter";
import { Plug } from "./plug";
import { PlugFactory } from "./plug-factory";
import { TargetTempHumidity } from "./target-temp-humidity";

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
  clime: Clime;
  day: AirDirectives;
  night: AirDirectives;
  lamps: LampTimer;
  blowers: BlowerTimer;
  socket: WebSocket;
  systems: Map<string, boolean>;
  meters: Map<Meter, Clime>;
  plugs: Map<string, Array<Plug>>;
  macaddr: string;
  heldMessages: Array<any>;

  private constructor() {
    console.log("process.argv", process.argv);

    if (process.argv.length > 2) {
      const arg = process.argv[2];
      console.log("arg", arg);
      if (arg.match(/^-C/)) {
        console.log("matched -C!");
      }
    }

    this.lamps = new LampTimer(
      parseInt(config.get("environment.lamp.start")),
      parseInt(config.get("environment.lamp.duration"))
    );

    this.blowers = new BlowerTimer(
      parseInt(config.get("environment.blower.active")),
      parseInt(config.get("environment.blower.cycle"))
    );

    if (config.get("environment.strategy") === "constant-vpd") {
      let vpd = vaporPressureDeficit(
        config.get("environment.lamp-on.temperature"),
        config.get("environment.lamp-on.delta"),
        config.get("environment.lamp-on.humidity")
      );

      this.day = new AirDirectives(
        new ConstantVpd([vpd, config.get("environment.vpd-tolerance")])
      );

      vpd = vaporPressureDeficit(
        config.get("environment.lamp-off.temperature"),
        config.get("environment.lamp-off.delta"),
        config.get("environment.lamp-off.humidity")
      );

      this.night = new AirDirectives(
        new ConstantVpd([vpd, config.get("environment.vpd-tolerance")])
      );
    } else {
      this.day = new AirDirectives(
        new TargetTempHumidity([
          config.get("environment.lamp-on.temperature"),
          config.get("environment.lamp-on.humidity")
        ])
      );

      this.night = new AirDirectives(
        new TargetTempHumidity([
          config.get("environment.lamp-off.temperature"),
          config.get("environment.lamp-off.humidity")
        ])
      );
    }

    this.socket = null;
    this.heldMessages = [];

    this.clime = new Clime(-1, 0.6, -1);

    this.systems = new Map([
      ["blower", false],
      ["dehumidifier", false],
      ["heater", false],
      ["humidifier", false],
      ["lamp", false]
    ]);

    this.meters = new Map();

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
        clime.humidity !== ad.serviceData.humidity
      ) {
        clime.temperature = ad.serviceData.temperature.c;
        clime.delta = 0.6;
        clime.humidity = ad.serviceData.humidity / 100.0;
        clime.timestamp = new Date();
        app.status(meter, clime);
      }
    } else {
      logger.debug(`XXX unhandled advertisement -- ${ad.id} XXX`);
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

    const factory = new PlugFactory(this.systems);
    await factory.build(config.get("credentials"));
    this.plugs = factory.plugs;

    this.macaddr = networkInterfaces()["wlo1"][0]["mac"];
    this.register(this.macaddr, config.get("id"));

    return new Promise(resolve => {
      logger.info("DAY >>", this.day);
      logger.info("NIGHT >>", this.night);
      logger.info(config);
      logger.info(this.meters);
      logger.info(this.plugs);
      logger.info("====================================");
      this.initialized = true;
      resolve(true);
    });
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

        app.socket.on("message", msg => {
          logger.debug("REC", msg);
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

    setTimeout(app.run, interval);

    return new Promise(resolve => {
      resolve(true);
    });
  }
}
