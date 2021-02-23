import WebSocket from "ws";
import config from "config";
import fs from "fs";

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
  day: AirDirectives;
  night: AirDirectives;
  lamps: LampTimer;
  blowers: BlowerTimer;
  socket: WebSocket;
  systems: Map<string, boolean>;
  mainMeter: Meter;
  clime: Clime;
  intakeMeter: Meter;
  plugs: Map<string, Array<Plug>>;

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

    this.clime = new Clime(-1, 0.6, -1);

    this.systems = new Map([
      ["blower", false],
      ["dehumidifier", false],
      ["heater", false],
      ["humidifier", false],
      ["lamp", false]
    ]);

    const devices: Array<Device> = config.get("devices");

    devices.forEach(device => {
      logger.debug("DEVICE", device);
      if (device.type === "main") {
        this.mainMeter = new Meter(device.id);
      } else if (device.type == "intake") {
        this.intakeMeter = new Meter(device.id);
      }
    });

    this.initialized = false;
  }

  async check(): Promise<Map<string, boolean>> {
    const app = App.instance();

    logger.debug("curr:", [
      app.mainMeter.clime.temperature,
      app.mainMeter.clime.humidity
    ]);
    logger.debug("last:", [app.clime.temperature, app.clime.humidity]);

    if (
      app.mainMeter.clime.temperature !== app.clime.temperature ||
      app.mainMeter.clime.humidity !== app.clime.humidity
    ) {
      logger.debug("changed!");
      app.clime = app.mainMeter.clime;

      app.systems.set("heater", false);
      app.systems.set("blower", false);
      app.systems.set("humidifier", false);
      app.systems.set("dehumidifier", false);

      logger.info(
        app.mainMeter.id,
        app.mainMeter.clime.temperature,
        app.mainMeter.clime.humidity
      );

      logger.info(
        app.intakeMeter.id,
        app.intakeMeter.clime.temperature,
        app.intakeMeter.clime.humidity
      );

      const hour = new Date().getHours();
      let directive: AirDirectives;

      if (app.lamps.isOn(hour)) {
        directive = app.day;
        app.clime.delta = -0.6;
      } else {
        directive = app.night;
        app.clime.delta = 0.3;
      }

      directive.clime = app.clime;
      directive.monitor();

      logger.debug(directive);

      if (directive.temperature === "heat") {
        app.systems.set("heater", true);
      } else if (directive.temperature === "cool") {
        app.systems.set("blower", true);
      } else {
        app.systems.set("heater", false);
      }

      if (directive.humidity === "humidify") {
        app.systems.set("humidifier", true);
      } else if (directive.humidity === "dehumidify") {
        app.systems.set("dehumidifier", true);
      } else {
        app.systems.set("dehumidifier", false);
        app.systems.set("humidifier", false);
      }
    }

    return app.systems;
  }

  public async handler(ad: WoSensorTH): Promise<boolean> {
    const app = App.instance();
    if (app.mainMeter.id === ad.id) {
      app.mainMeter.clime.temperature = ad.serviceData.temperature.c;
      app.mainMeter.clime.humidity = ad.serviceData.humidity / 100.0;
      app.mainMeter.clime.timestamp = new Date();
    } else if (app.intakeMeter && app.intakeMeter.id === ad.id) {
      app.intakeMeter.clime.temperature = ad.serviceData.temperature.c;
      app.intakeMeter.clime.humidity = ad.serviceData.humidity / 100.0;
      app.intakeMeter.clime.timestamp = new Date();
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
    logger.info("====================================");
    logger.info("Starting up...");

    const factory = new PlugFactory(this.systems);
    await factory.build(config.get("credentials"));
    this.plugs = factory.plugs;

    return new Promise(resolve => {
      logger.info("DAY >>", this.day);
      logger.info("NIGHT >>", this.night);
      logger.info(config);
      logger.info(this.mainMeter);
      logger.info(this.intakeMeter);
      logger.info(this.plugs);
      logger.info("====================================");
      this.initialized = true;
      resolve(true);
    });
  }

  public async run(): Promise<boolean> {
    const app = App.instance();
    if (!app.initialized) {
      await app.init();
    }

    const polling: number = 1000 * parseInt(config.get("polling"));
    const interval: number = 1000 * parseInt(config.get("interval"));

    logger.debug("Start main meter scan for %dms ...", polling);
    app.mainMeter.bot.onadvertisement = app.handler;
    await app.mainMeter.startScan();
    await app.mainMeter.wait(polling);
    await app.mainMeter.stopScan();
    logger.debug("Done main meter scan.");

    if (app.intakeMeter) {
      logger.debug("Start intake meter scan for %dms ...", polling);
      app.intakeMeter.bot.onadvertisement = app.handler;
      await app.intakeMeter.startScan();
      await app.intakeMeter.wait(polling);
      await app.intakeMeter.stopScan();
      logger.debug("Done scan.");
    }

    logger.debug("Check if climate has changed...");
    await app.check();
    logger.debug("done.");

    const now: Date = new Date();
    const hour: number = now.getHours();
    const min: number = now.getMinutes();
    const sec: number = now.getSeconds();

    if (app.lamps.isOn(hour)) {
      app.systems.set("lamp", true);
    } else {
      app.systems.set("lamp", false);
    }

    if (app.blowers.isOn(min * 60 + sec)) {
      app.systems.set("blower", true);
    } else {
      app.systems.set("blower", false);
    }

    logger.debug("Apply systems command to plugs...");
    logger.debug("SYSTEMS", app.systems);
    logger.debug("PLUGS", app.plugs);

    app.plugs.forEach((value: Array<Plug>, key: string) => {
      console.log("this key here", key);
      value.forEach(plug => {
        console.log("this plug here", plug);
        if (app.systems.get(key)) {
          plug
            .on()
            .then(() => {
              logger.debug(plug.bot.device.nickname, "plug on OK");
            })
            .catch(result => {
              logger.error(plug.bot.device.nickname, "plug on NOT OK", result);
              if (app.socket && app.socket.readyState === 1) {
                const data = {
                  type: "ERROR",
                  payload: {  
                    client: config.get("id"),
                    plug: plug.bot.device.nickname,
                    action: "on",
                    code: result.code,
                    message: result.msg,
                    timestamp: new Date()
                  }
                };

        console.log("sending...", data);
                  app.socket.send(JSON.stringify(data));
              }
            });
        } else {
          plug
            .off()
            .then(() => {
              logger.debug(plug.bot.device.nickname, "plug off OK");
            })
            .catch(result => {
              logger.error(plug.bot.device.nickname, "plug off NOT OK", result);
              if (app.socket && app.socket.readyState === 1) {
                const data = {
                  type: "ERROR",
                  payload: {  
                    client: config.get("id"),
                    plug: plug.bot.device.nickname,
                    action: "on",
                    code: result.code,
                    message: result.msg,
                    timestamp: new Date()
                  }
                };

        console.log("sending...", data);
                app.socket.send(JSON.stringify(data));
              }
            });
        }
      });
    });

    logger.debug("Done apply systems command.");

    logger.debug("Checking app socket...");

    if (app.socket && app.socket.readyState !== 1) {
      logger.debug("Ready state:", app.socket.readyState);
      app.socket = null;
    }

    logger.debug("Done.");

    if (app.socket === null) {
      try {
        app.socket = new WebSocket(config.get("ws-url"));

        app.socket.on("error", err => {
          console.log("Caught", err);
        });

        app.socket.on("close", () => {
          logger.debug("THIS SOCKET IS CLOSED");
        });

        app.socket.on("message", (msg: string) => {
          console.log("A message!", msg);
        });
      } catch (e) {
        console.log("Try again!", e);
      }
    } else {
      const data = {
        type: "STATUS",
        payload: {
          client: config.get("id"),
          blower: app.systems.get("blower"),
          dehumidifier: app.systems.get("dehumidifier"),
          heater: app.systems.get("heater"),
          humidifier: app.systems.get("humidifier"),
          lamp: app.systems.get("lamp"),
          timestamp: new Date()
        }
      };

      if (app.mainMeter) {
        data["payload"]["main"] = {
          meter: app.mainMeter.id,
          temperature: app.mainMeter.clime.temperature,
          humidity: app.mainMeter.clime.humidity
        };
      }

      if (app.intakeMeter) {
        data["payload"]["intake"] = {
          meter: app.intakeMeter.id,
          temperature: app.intakeMeter.clime.temperature,
          humidity: app.intakeMeter.clime.humidity
        };
      }

        console.log("sending...", data);
      app.socket.send(JSON.stringify(data));
    }

    logger.debug("Done all. Timeout in %dms.", interval - 2 * polling);
    setTimeout(app.run, interval - 2 * polling);

    return new Promise(resolve => {
      resolve(true);
    });
  }
}
