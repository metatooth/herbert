import { Device } from "./device";

export class Switch extends Device {
  public on() {
    console.log("switch on?", this.state);
    this.state = "on";
  }

  public off() {
    console.log("switch off?", this.state);
    this.state = "off";
  }

  public status() {
    return this;
  }
}
