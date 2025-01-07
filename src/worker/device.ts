import { AnySocketMessage } from "../shared/types";

export class Device {
  device: string;
  manufacturer: string;
  state = "";

  constructor(device: string, manufacturer: string) {
    this.device = device;
    this.manufacturer = manufacturer;
  }

  status(): AnySocketMessage {
    throw new Error("Must implement status() in derived class.");
  }
}
