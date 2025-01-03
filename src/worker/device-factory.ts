import { Device } from "./device";
import { Herbert } from "./herbert";
import { IRSend } from "./i-r-send";
import { MockMeter } from "./mock-meter";
import { MockPlug } from "./mock-plug";
import { SequentMicrosystems } from "./sequent-microsystems";
import { formatMacAddress } from "../shared/utils";

export class DeviceFactory {
  constructor() {}

  createDevice(config): Device | null {
    const mac = formatMacAddress(config.id);
    if (config.manufacturer === "herbert") {
      if (config.pin) {
        return new Herbert(mac, parseInt(config.pin));
      } else if (config.board && config.channel) {
        return new SequentMicrosystems(
          mac,
          parseInt(config.board),
          parseInt(config.channel)
        );
      } else if (config.remote && config.mode) {
        return new IRSend(mac, config.remote, config.mode);
      }
    } else if (config.manufacturer === "mockmeter") {
      return new MockMeter(mac);
    } else if (config.manufacturer === "mockplug") {
      return new MockPlug(mac);
    }

    return null;
  }
}
