import { Switch } from "./switch";
import { exec } from "child_process";

export class IRSend extends Switch {
  remote: string;
  mode: string;

  constructor(device: string, remote: string, mode: string) {
    super(device, "herbert");
    this.remote = remote;
    this.mode = mode;
    this.state = "off";
  }

  public on() {
    exec(`irsend SEND_ONCE ${this.remote} POWER_ON`);
    this.state = "on";
  }

  public off() {
    exec(`irsend SEND_ONCE ${this.remote} POWER_OFF`);
    this.state = "off";
  }
}
