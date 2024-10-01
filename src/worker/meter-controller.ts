import EventEmitter from "events";

import { App } from "./app";
import { Meter } from "./meter";

import { formatMacAddress } from "../shared/utils";
import { AnySocketMessage } from "../shared/types";
import { makeMeterStatusMessage } from "../shared/message-creators";

import Switchbot, { WoSensorTH } from "node-switchbot";

interface MeterControllerOptions {
  polling: number;
  send: (message: AnySocketMessage) => void;  
}

export class MeterController extends EventEmitter {
  meters: Array<Meter> = [];
  options: MeterControllerOptions;
    
  public constructor(options: MeterControllerOptions) {
    super();
    this.options = options;
  }

  add(meter: Meter) {
      this.meters.push(meter);
  }
    
  poll() {
    console.log(new Date(), " POLL");

    if (this.meters.length != 0) {
      this.meters.forEach((meter) => {
        this.meterStatus(meter);
      });
    } else {
      const switchbot = new Switchbot();
      switchbot.onadvertisement = this.switchBotHandler;
      switchbot.startScan();
      switchbot.wait(this.options.polling);
      switchbot.stopScan();
    }
  };

  switchBotHandler(ad: WoSensorTH): Promise<boolean> {
    let meter = new Meter(ad.id, "SwitchBot");
    meter.clime.temperature = ad.serviceData.temperature.c;
    meter.clime.delta = 0.6; // WARNING!
    meter.clime.humidity = ad.serviceData.humidity / 100.0;
    meter.clime.timestamp = new Date();

    return this.meterStatus(meter);
  };

  meterStatus(meter: Meter): Promise<boolean> {
    const msg = makeMeterStatusMessage({
      device: formatMacAddress(meter.device),
      type: "meter",
      manufacturer: meter.manufacturer,
      temperature: meter.clime.temperature,
      humidity: meter.clime.humidity,
      timestamp: new Date().toString(),
    });

    console.log("send this message", msg);

    this.options.send(msg);
 
    return Promise.resolve(true);
  }
}
