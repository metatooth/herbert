import { Switch } from "./switch";
import { exec } from "child_process";

export class IRSend extends Switch {
  remote: string;

  constructor(device: string, remote: string) {
    super(device, "herbert");
    this.remote = remote;
    this.state = "off";
  }

  public on() {
    exec(
      `irsend SEND_ONCE ${this.remote} POWER_ON`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        if (stdout) {
          console.log(`stdout: ${stdout}`);
        }
      }
    );
    this.state = "on";
  }

  public off() {
    exec(
      `irsend SEND_ONCE ${this.remote} POWER_OFF`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        if (stdout) {
          console.log(`stdout: ${stdout}`);
        }
      }
    );
    this.state = "off";
  }
}
