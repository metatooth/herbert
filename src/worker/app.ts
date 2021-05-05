import WebSocket from "ws";
import config from "config";
import fs from "fs";
import { networkInterfaces } from "os";

import { Meter } from "./meter";
import { MockMeter } from "./mock-meter";
import { Switch } from "./switch";
import { Herbert } from "./herbert";
import { SM8relay } from "./sm-8relay";
import { WyzeSwitch } from "./wyze-switch";
import { IRSend } from "./i-r-send";

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

interface Message {
  type: string;
  payload: {};
}

export class App {
  private static _instance: App;
  initialized: boolean;
  socket: WebSocket;
  meters: Array<Meter>;
  switches: Array<Switch>;
  macaddr: string;
  inet: string;
  heldMessages: Array<Message>;
  wyze: Wyze;

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

    this.meters = [];

    this.switches = [];

    this.initialized = false;
  }

  public async handler(ad: WoSensorTH): Promise<boolean> {
    const app = App.instance();

    let meter = app.meters.find(el => {
      return el.device === ad.id;
    });

    if (!meter) {
      meter = new Meter(ad.id, "SwitchBot");
      app.meters.push(meter);
    }

    if (
      meter.clime.temperature !== ad.serviceData.temperature.c ||
      meter.clime.humidity !== ad.serviceData.humidity / 100.0
    ) {
      meter.clime.temperature = ad.serviceData.temperature.c;
      meter.clime.delta = 0.6; // WARNING!
      meter.clime.humidity = ad.serviceData.humidity / 100.0;
      meter.clime.timestamp = new Date();
      logger.debug(meter.device, meter.clime);
      app.meterStatus(meter);
    }

    return Promise.resolve(true);
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
    this.inet = net[0]["address"];

    console.log("wlan0", this.macaddr, this.inet);

    const meters = this.meters;
    const switches = this.switches;

    config.get("devices").forEach(dev => {
      logger.debug("DEVICE", dev);
      if (dev.manufacturer === "WYZE") {
        const options = {
          username: dev.username,
          password: dev.password
        };

        this.wyze = new Wyze(options);
      } else if (dev.manufacturer === "herbert") {
        if (dev.pin) {
          switches.push(new Herbert(dev.id, parseInt(dev.pin)));
        } else if (dev.board && dev.channel) {
          switches.push(
            new SM8relay(dev.id, parseInt(dev.board), parseInt(dev.channel))
          );
        } else if (dev.remote) {
          switches.push(new IRSend(dev.id, dev.remote));
        }
      } else if (dev.manufacturer === "mockbot") {
        meters.push(new MockMeter());
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
            console.log("action!", data.payload);
            const mac = data.payload.device.replace(/:/g, "").toUpperCase();
            console.log("MAC...", mac);
            if (this.wyze) {
              const device = await this.wyze.getDeviceByMac(mac);
              if (device) {
                console.log("Found.");
                let result;
                if (data.payload.action === "on") {
                  result = await this.wyze.turnOn(device);
                } else {
                  result = await this.wyze.turnOff(device);
                }
                if (result.code !== "1") {
                  logger.error(
                    `ERROR ${result.code} ${device.nickname} ${data.payload.action} - ${result}`
                  );
                  const reply = {
                    type: "ERROR",
                    payload: {
                      worker: app.macaddr,
                      device: data.payload.device,
                      action: data.payload.action,
                      code: result.code,
                      message: result.msg,
                      timestamp: new Date()
                    }
                  };
                  app.heldMessages.push(reply);
                }
              }
            }

            console.log("Check other devices...");
            app.switches.forEach(plug => {
              if (plug.device === data.payload.device) {
                if (data.payload.action === "on") {
                  console.log(plug.device, "on");
                  plug.on();
                } else {
                  console.log(plug.device, "off");
                  plug.off();
                }
              }
            });
            console.log("Done.");
          }
        });
      } catch (e) {
        logger.error("Caught", e);
      }
    } else if (app.socket.readyState !== 1) {
      app.heldMessages.push(data);
    } else {
      logger.debug("Sending data", data);
      app.socket.send(JSON.stringify(data));

      app.heldMessages.forEach(msg => {
        logger.debug("Sending held message", msg);
        app.socket.send(JSON.stringify(msg));
      });

      app.heldMessages = [];
    }
  }

  private async meterStatus(meter: Meter) {
    const data = {
      type: "STATUS",
      payload: {
        device: meter.device,
        type: "meter",
        manufacturer: meter.manufacturer,
        temperature: meter.clime.temperature,
        humidity: meter.clime.humidity,
        pressure: meter.clime.vpd(),
        timestamp: new Date()
      }
    };
    this.send(data);
  }

  private async switchStatus(switcher: Switch) {
    const data = {
      type: "STATUS",
      payload: {
        device: switcher.device,
        manufacturer: switcher.manufacturer,
        status: switcher.state,
        timestamp: new Date()
      }
    };
    this.send(data);
  }

  private async workerStatus(macaddr: string, inet: string) {
    const data = {
      type: "STATUS",
      payload: {
        worker: macaddr,
        inet: inet,
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

    app.workerStatus(this.macaddr, this.inet);

    const polling: number = 1000 * parseInt(config.get("polling"));
    const interval: number = 1000 * parseInt(config.get("interval"));

    logger.debug("Start SwitchBot scan %dms ...", polling);
    const switchbot = new Switchbot();
    switchbot.onadvertisement = app.handler;
    switchbot.startScan();
    switchbot.wait(polling);
    switchbot.stopScan();
    logger.debug("Done switchbot scan.");

    if (app.wyze) {
      logger.debug("Check on WYZE plugs...");
      const wyzes = await app.wyze.getDeviceList();
      wyzes.forEach(async wyze => {
        if (wyze.conn_state === 0) {
          const data = {
            type: "ERROR",
            payload: {
              id: wyze.mac,
              device: wyze.mac,
              message: "disconnected",
              timestamp: new Date()
            }
          };

          app.send(JSON.stringify(data));
        }

        const plug = new WyzeSwitch(wyze.mac);

        if (wyze.conn_state === 0) {
          plug.state = "disconnected";
        } else if (wyze.device_params.switch_state === 1) {
          plug.state = "on";
        } else {
          plug.state = "off";
        }

        app.switchStatus(plug);
      });
    }

    logger.debug("Done.");

    logger.debug("Other meters...");
    app.meters.forEach(meter => {
      if (meter.manufacturer === "mockbot") {
        const now = new Date().getTime();
        meter.clime.temperature = 23.9 + Math.sin((2 * 3.14 * now) / 3600000);
        meter.clime.humidity =
          0.55 + 0.02 * Math.cos((2 * 3.14 * now) / 3600000);
      }
      app.meterStatus(meter);
    });
    logger.debug("Done.");

    logger.debug("Herbert switches...");
    app.switches.forEach(plug => {
      app.switchStatus(plug.status());
    });
    logger.debug("Done.");

    setTimeout(app.run, interval);

    return Promise.resolve(true);
  }
}
