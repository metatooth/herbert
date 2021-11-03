import { Switch } from "./switch";
import { exec } from "child_process";

export class SequentMicrosystems extends Switch {
  board: number;
  channel: number;

  constructor(device: string, board: number, channel: number) {
    super(device, "SequentMicrosystems");
    this.board = board;
    this.channel = channel;
  }

  public on() {
    console.log("SM 8-relay ON?", this.state);
    if (this.state === "off" || this.state === "0") {
      exec(
        `8relind ${this.board} write ${this.channel} on`,
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
  }

  public off() {
    console.log("SM 8-relay OFF?", this.state);
    if (this.state === "on" || this.state === "1") {
      exec(
        `8relind ${this.board} write ${this.channel} off`,
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

  public status() {
    exec(
      `8relind ${this.board} read ${this.channel}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        if (stdout.replace(/[\n]$/, "") === "1") {
          this.state = "on";
        } else {
          this.state = "off";
        }
      }
    );
    return this;
  }
}
