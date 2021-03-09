import { Switch } from "./switch";

export class Herbert extends Switch {
  pin: string;

  constructor(device: string, pin: string) {
    super(device, "herbert");
    this.pin = pin;
  }
}
