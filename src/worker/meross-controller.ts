import EventEmitter from "events";
import MerossCloud from "meross-cloud";

import { MerossSwitch } from "./meross-switch";

interface MerossOptions {
  email: string;
  password: string;
  logger: (data: string) => void;
  localHttpFirst: boolean;
}

export class MerossController extends EventEmitter {
  meross: MerossCloud;
  switches: Array<MerossSwitch> = [];

  constructor(options: MerossOptions) {
    super();

    this.meross = new MerossCloud(options);

    const switches = this.switches;

    this.meross.on("deviceInitialized", async (id, definition, device) => {
      device.on("connected", () => {
        device["deviceConnected"] = true;
        switches.push(new MerossSwitch(device));
      });

      device.on("close", () => {
        console.log("closed am i");
      });

      device.on("error", () => {
        console.log("error am i");
      });

      device.on("reconnect", () => {
        console.log("reconnected am i");
      });

      device.on("data", (data) => {
        console.log("any data?", data);
      });

      device.on("rawData", (data) => {
        if (data.payload && data.payload.togglex) {
          switches.forEach((plug) => {
            if (plug.plug["dev"]["uuid"] === data.header.uuid) {
              console.log("data.payload for plug, ", data.payload);
              if (data.payload.togglex.onoff === 1) {
                plug.state = "on";
              } else {
                plug.state = "off";
              }
            }
          });
        }
      });
    });

    this.meross.connect((error) => {
      if (error) {
        console.error("connect error: " + error);
      }
    });
  }

  poll() {
    console.log("POLL");
    this.switches.forEach((device) => {
      device.plug.controlToggleX(1, true, (err, res) => {
        console.log(
          "Toggle Response - err: " + err + " & res: " + JSON.stringify(res)
        );
      });
    });
  }

  push(message) {
    console.log("MESSAGE");
    console.log(message);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    this.switches.forEach((device) => {
      console.log(device.device);
    });
  }
}
