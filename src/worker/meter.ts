import { Device } from "./device";
import { Clime } from "./clime";

export class Meter extends Device {
  clime: Clime;

  constructor(device: string, manufacturer: string) {
    super(device, manufacturer);
    this.clime = new Clime(0, 0, 0);
  }
}
