import { Gpio } from "onoff";
import { Switch } from "./switch";

export class Herbert extends Switch {
  pin: number;
  output: Gpio;

  constructor(device: string, pin: number) {
    super(device, "herbert");
    this.pin = pin;

    this.output = new Gpio(pin, "out");
    this.status();
  }

  public on() {
    this.output.writeSync(1);
  }

  public off() {
    this.output.writeSync(0);
  }

  public status() {
    if (this.output.readSync() === 1) {
      this.state = "on";
    } else {
      this.state = "off";
    }
    return this;
  }
}
