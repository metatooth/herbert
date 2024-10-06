import EventEmitter from "events";

import { App } from "./app";
import { Switch } from "./switch";

import { formatMacAddress } from "../shared/utils";
import { AnySocketMessage, CommandPayload } from "../shared/types";
import { makeSwitchStatusMessage } from "../shared/message-creators";

interface SwitchControllerOptions {
  send: (message: AnySocketMessage) => void;  
}

export class SwitchController extends EventEmitter {
  switches: Array<Switch> = [];
  options: SwitchControllerOptions;
    
  public constructor(options: SwitchControllerOptions) {
    super();
    this.options = options;
  }

  add(switcher: Switch) {
      this.switches.push(switcher);
  }
    
  poll() {
    console.log(new Date(), " POLL");

      this.switches.forEach((switcher) => {
          this.switchStatus(switcher);
      });
  }

  handle(data: CommandPayload) {
    const mac = formatMacAddress(data.device);
    this.switches.forEach((plug) => {
      if (formatMacAddress(plug.device) === mac) {
        if (data.action === "on") {
          plug.on();
        } else if (data.action === "off") {
          plug.off();
        }
      }
    });
  }
    
  switchStatus(switcher: Switch): Promise<boolean> {
    const msg = makeSwitchStatusMessage({
      device: formatMacAddress(switcher.device),
      manufacturer: switcher.manufacturer,
      status: switcher.state,
      timestamp: new Date().toString(),
    });

    console.log("SEND Switch ", msg);

    this.options.send(msg);

    return Promise.resolve(true);
  }
    
}
