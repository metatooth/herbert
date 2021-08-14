import WebSocket from "ws";
import fs from "fs";
import { networkInterfaces } from "os";

import { Meter } from "./meter";
import { MockMeter } from "./mock-meter";
import { MockPlug } from "./mock-plug";
import { Switch } from "./switch";
import { Herbert } from "./herbert";
import { SM8relay } from "./sm-8relay";
import { WyzeSwitch } from "./wyze-switch";
import { IRSend } from "./i-r-send";
import {HerbertSocketMessage, HerbertMessageType, isHerbertMessageType, isHerbertSocketMessage } from '../shared/types';

import Switchbot, { WoSensorTH } from "node-switchbot";
import Wyze, { WyzeDevice } from "wyze-node";

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

import { configure, getLogger, Logger } from "log4js";

configure("./config/log4js.json");
const logger: Logger = getLogger("app");

interface ConfigDevice {
  id: string;
  manufacturer: string;
  username?: string;
  password?: string;
  board?: string;
  remote?: string;
  pin?: string;
  channel?: string;
}

export class App {
  private static instance: App;
  private config: any = {};
  private wsUrl = process.env.WS_URL || '';
  private closed = false;
  initialized = false;
  socket?: WebSocket = undefined;
  meters: Array<Meter> = [];
  switches: Array<Switch> = [];
  macaddr = "";
  inet = "";
  heldMessages: HerbertSocketMessage[] = [];
  wyze?: Wyze;
  switchbot: Switchbot | undefined;
  runTimeout: NodeJS.Timeout | undefined;

  public constructor() {
    App.instance = App.instance || this;
    return App.instance;
  }

  public init(): Promise<void> {
    logger.info("=====================================");
    logger.info("== Herbert Worker = Starting up... ==");
    logger.info("=====================================");

    const ifaces = networkInterfaces();
    logger.info("network interfaces", ifaces);

    let net = ifaces["wlo1"];

    if (!net) {
      net = ifaces["wlan0"];
    }

    if (!net) {
      net = ifaces["eth0"];
    }

    logger.info("net", net);

    if (net && net.length) {
      this.macaddr = net[0]["mac"];
      this.inet = net[0]["address"];
    }

    logger.info("device network info", this.macaddr, this.inet);

    this.createSocket();

    return new Promise((resolve) => {
      const i = setInterval(() => {
        if (this.initialized) {
          clearInterval(i);
          return resolve();
        }
        this.send({
          type: HerbertMessageType.Register,
          payload: {
            worker: this.macaddr,
            inet: this.inet,
          },
        });
      }, 2000);
    });
  }

  public readonly run = async (): Promise<void> => {
    if (!this.initialized) {
      return Promise.reject("app is not initialized");
    }

    this.workerStatus();

    const polling: number = 1000 * parseInt(this.config.polling || 5);
    const interval: number = 1000 * parseInt(this.config.interval || 30);

    if (!isMockWorker()) {
      logger.debug("Start SwitchBot scan %dms ...", polling);
      const switchbot = new Switchbot();
      switchbot.onadvertisement = this.switchBotHandler;
      switchbot.startScan();
      switchbot.wait(polling);
      switchbot.stopScan();
      this.switchbot = switchbot;
      logger.debug("Done switchbot scan.");
    }

    if (this.wyze) {
      logger.debug("Check on WYZE plugs...");
      const wyzes = await this.wyze.getDeviceList();
      wyzes.forEach(async (wyze: WyzeDevice) => {
        if (wyze.conn_state === 0) {
          const data = {
            type: HerbertMessageType.Error,
            payload: {
              id: wyze.mac,
              device: wyze.mac,
              message: "disconnected",
              timestamp: new Date()
            }
          };

          this.send(data);
        }

        const plug = new WyzeSwitch(wyze.mac);

        if (wyze.conn_state === 0) {
          plug.state = "disconnected";
        } else if (wyze.device_params.switch_state === 1) {
          plug.state = "on";
        } else {
          plug.state = "off";
        }

        this.switchStatus(plug);
      });
    }

    logger.debug("Done.");

    logger.debug("Other meters...");
    this.meters.forEach(meter => {
      if (meter.manufacturer === "mockmeter") {
        const now = new Date().getTime();
        meter.clime.temperature = 23.9 + Math.sin((2 * 3.14 * now) / 3600000);
        meter.clime.humidity =
          0.55 + 0.02 * Math.cos((2 * 3.14 * now) / 3600000);
      }
      this.meterStatus(meter);
    });
    logger.debug("Done.");

    logger.debug("Herbert switches...");
    this.switches.forEach(plug => {
      this.switchStatus(plug.status());
    });
    logger.debug("Done.");

    if (this.runTimeout) {
      clearTimeout(this.runTimeout);
      this.runTimeout = undefined;
    }

    this.runTimeout = setTimeout(this.run, interval);
  }

  public stop() {
    if (this.runTimeout) {
      clearTimeout(this.runTimeout);
      this.runTimeout = undefined;
    }

    if (this.switchbot) {
      this.switchbot.stopScan();
      this.switchbot.onadvertisement = undefined;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
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
    let meter = this.meters.find(el => {
      return el.device === ad.id;
    });

    if (!meter) {
      meter = new Meter(ad.id, "SwitchBot");
      this.meters.push(meter);
    }

    meter.clime.temperature = ad.serviceData.temperature.c;
    meter.clime.delta = 0.6; // WARNING!
    meter.clime.humidity = ad.serviceData.humidity / 100.0;
    meter.clime.timestamp = new Date();

    logger.debug(meter.device, meter.clime);

    this.meterStatus(meter);

    return Promise.resolve(true);
  }

  private initDevices() {
    const meters = [];
    const switches = [];
    const devices = (
      this.config &&
      this.config.devices &&
      Array.isArray(this.config.devices)
    ) ?
      this.config.devices as ConfigDevice[] :
      [] as ConfigDevice[];

    devices.forEach(dev => {
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
      } else if (dev.manufacturer === "mockmeter") {
        const meter = new MockMeter(dev.id);
        meters.push(meter);
      } else if (dev.manufacturer === "mockplug") {
        const plug = new MockPlug(dev.id);
        plug.off();
        switches.push(plug);
      }

    });

    this.meters = meters;
    this.switches = switches;
    this.initialized = true;
  }

  private async createSocket(): Promise<void> {
    if (this.socket) {
      this.stop();
    }

    this.socket = new WebSocket(this.wsUrl);
    this.socket.on("error", this.onSocketError);
    this.socket.on("close", this.onSocketClose);
    this.socket.on("message", this.handleSocketMessage);
  }

  private readonly onSocketError = (err: Error) => {
    logger.error(err);
  }

  private readonly onSocketClose = () => {
    logger.info("Socket is closed")
    if (this.closed) { return; }
    setTimeout(this.restart, 5000);
  }

  private restart = async () => {
    this.stop();
    await this.init();
    await this.run();
  }

  private readonly handleSocketMessage = async (msg: HerbertSocketMessage) => {
    try {
      const data = JSON.parse(msg.toString());

      if (!isHerbertSocketMessage(data)) {
        logger.warn('unknown message format:', data);
        return;
      }

      switch (data.type) {
        case HerbertMessageType.Configure:
          if (data.payload.worker === this.macaddr) {
            logger.info("!! CONFIGURE !!", data.payload.config);
            this.config = JSON.parse(data.payload.config);
            this.initDevices();
          }
          break;
        case HerbertMessageType.Command:
          logger.info("action!", data.payload);
          await this.updateWYZE(data);
          this.updateSwitches(data);
          logger.info("Done.");
          break;
        default:
          logger.warn("Unknown socket message type:", data.type);
          break;
      }
    } catch (e) {
      logger.error("socket message error:", e);
    }
  }

  private async send(data: HerbertSocketMessage) {
    if (this.socket === undefined || this.socket.readyState !== 1) {
      this.heldMessages.push(data);
      return;
    }

    try {
      logger.debug("Sending data", data);
      this.socket.send(JSON.stringify(data));

      for (let i = 0; i < this.heldMessages.length; ++i) {
        if (this.socket) {
          const msg = this.heldMessages.shift();
          logger.debug("Sending held message", msg);
          this.socket.send(JSON.stringify(msg));
        }
      }
    } catch(e) {
      logger.error("failed to send message:", e);
    }
  }

  private async updateWYZE(data: any) {
    if (this.wyze) {
      const mac = this.macFromData(data);
      logger.info("MAC...", mac);
      const device = await this.wyze.getDeviceByMac(mac);
      if (device) {
        logger.info("Found.");
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
            type: HerbertMessageType.Error,
            payload: {
              worker: this.macaddr,
              device: data.payload.device,
              action: data.payload.action,
              code: result.code,
              message: result.msg,
              timestamp: new Date()
            }
          };
          this.heldMessages.push(reply);
        }
      }
    }
  }

  private updateSwitches(data: any) {
    logger.info("Check switches...");
    const mac = this.macFromData(data);
    this.switches.forEach(plug => {
      if (plug.device === mac) {
        if (data.payload.action === "on") {
          logger.info(plug.device, "on");
          plug.on();
        } else {
          logger.info(plug.device, "off");
          plug.off();
        }
      }
    });
  }

  private async meterStatus(meter: Meter) {
    const data = {
      type: HerbertMessageType.Status,
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
      type: HerbertMessageType.Status,
      payload: {
        device: switcher.device,
        manufacturer: switcher.manufacturer,
        status: switcher.state,
        timestamp: new Date()
      }
    };
    this.send(data);
  }

  private async workerStatus() {
    const data = {
      type: HerbertMessageType.Status,
      payload: {
        worker: this.macaddr,
        inet: this.inet,
        config: JSON.stringify(this.config),
        timestamp: new Date()
      }
    };
    this.send(data);
  }

  private macFromData(data: any): string {
    let mac = '';
    if (data && data.payload && data.payload.device) {
      mac = data.payload.device.replace(/:/g, "").toUpperCase();
    }
    return mac;
  }
}
