import { formatMacAddress } from "../shared/utils";

import { Device } from "./device";
import { Herbert } from "./herbert";
import { IRSend } from "./i-r-send";
import { MockMeter } from "./mock-meter";
import { MockPlug } from "./mock-plug";
import { SequentMicrosystems } from "./sequent-microsystems";
import { ThermoPro } from "./thermo-pro";

import { SwitchBotBLE } from "node-switchbot";

export class DeviceFactory {
  constructor() {}

  parseDevices(config): Promise<Array<Device>> {
    const devices = [];

    config.devices.forEach(async (item) => {
      const device = await this.createDevice(item);
      if (device) {
        devices.push(device);
      }
    });

    return Promise.resolve(devices);
  }

  private async createDevice(config): Promise<Device | null> {
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
      case "switchbot":
        const switchbot = new SwitchBotBLE();
        try {
          switchbot.onadvertisement = (ad) => {
            console.log("an ad", ad);
          };
          switchbot.startScan();
          switchbot.wait(30000);
          switchbot.stopScan();
        } catch (e: any) {
          console.error(
            `Failed to start BLE scanning, Error: ${e.message ?? e}`,
          );
        }
        break;
      case "thermopro":
        device = new ThermoPro();
        break;
      default:
    }

    return device;
  }
}
