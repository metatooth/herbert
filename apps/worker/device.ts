import { AnySocketMessage } from "../shared/types";

export class Device {
  device: string;
  manufacturer: string;
  state = "";

  constructor(device: string, manufacturer: string) {
    this.device = device;
    this.manufacturer = manufacturer;
  }

  public on() {
    throw new Error("Must implement on() in derived class.");
  }

  public off() {
    throw new Error("Must implement off() in derived class.");
  }

  status(): AnySocketMessage {
    throw new Error("Must implement status() in derived class.");
  }
}
