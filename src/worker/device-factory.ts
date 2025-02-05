import { formatMacAddress } from "../shared/utils";

import { Device } from "./device";
import { Herbert } from "./herbert";
import { IRSend } from "./i-r-send";
import { MockMeter } from "./mock-meter";
import { MockPlug } from "./mock-plug";
import { SequentMicrosystems } from "./sequent-microsystems";
import { ThermoPro } from "./thermo-pro";

export class DeviceFactory {
  constructor() {}

  parseDevices(config): Promise<Array<Device>> {
    const devices = [];

    config.devices.forEach(async (item) => {
      const device = this.createDevice(item);
      if (device) {
        devices.push(device);
      } else {
        switch (item.manufacturer) {
          case "thermopro":
            console.log("start thermopro");
            const pro = new ThermoPro();
            await pro.scan();
            console.log("done thermopro");

            break;
          default:
        }
      }
    });

    return Promise.resolve(devices);
  }

  private createDevice(config): Device | null {
    const mac = formatMacAddress(config.id);
    let device = null;

    switch (config.manufacturer) {
      case "herbert":
        if (config.pin) {
          device = new Herbert(mac, parseInt(config.pin));
        } else if (config.board && config.channel) {
          device = new SequentMicrosystems(
            mac,
            parseInt(config.board),
            parseInt(config.channel),
          );
        } else if (config.remote && config.mode) {
          device = new IRSend(mac, config.remote, config.mode);
        }
        break;
      case "mockmeter":
        device = new MockMeter(mac);
        break;
      case "mockplug":
        device = new MockPlug(mac);
        break;
      default:
    }

    return device;
  }
}
