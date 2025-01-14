import { AnySocketMessage } from "../shared/types";
import { Clime } from "../shared/clime";
import { makeMeterStatusMessage } from "../shared/message-creators";

import { Device } from "./device";

export class Meter extends Device {
  clime: Clime;

  constructor(device: string, manufacturer: string) {
    super(device, manufacturer);
    this.clime = new Clime(0, 0);
  }

  status(): AnySocketMessage {
    return makeMeterStatusMessage({
      device: this.device,
      manufacturer: this.manufacturer,
      type: "",
      temperature: this.clime.temperature,
      humidity: this.clime.humidity,
      timestamp: new Date().toString(),
    });
  }
}
