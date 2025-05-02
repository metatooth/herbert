import { EventEmitter } from "events";

import { Device } from "./device";

export class DeviceManager extends EventEmitter {
  devices: Array<Device> = [];

  constructor() {
    super();
  }

  poll() {
    console.log("POLL");
    this.devices.forEach((device) => {
      console.log(`device [${device.device}]`);
    });
  }

  push(message) {
    console.log("MESSAGE");
    console.log(message);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    this.devices.forEach((device) => {
      console.log(`device ${device.device}`);
    });
  }
}
