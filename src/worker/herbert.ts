import { Gpio } from "onoff";
import { Switch } from "./switch";

export class Herbert extends Switch {
  pin: number;
  output: Gpio;

  constructor(device: string, pin: number) {
    super(device, "herbert");
    this.pin = pin;

    this.output = new Gpio(pin, "out");
    console.log("init herbert on?", this.output.readSync());
  }

  public on() {
    console.log("herbert on?", this.output.readSync());
    this.output.writeSync(1);
  }

  public off() {
    console.log("herbert off?", this.output.readSync());
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
