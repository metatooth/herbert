import { Switch } from "./switch";
import { exec } from "child_process";

export class SM8relay extends Switch {
  board: number;
  channel: number;

  constructor(device: string, board: number, channel: number) {
    super(device, "sm-8relay");
    this.board = board;
    this.channel = channel;
  }

  public on() {
    exec(`8relay ${this.board} write ${this.channel} on`,
         (error, stdout, stderr) => {
           if (error) {
             console.log(`error: ${error.message}`);
           }
           if (stderr) {
             console.log(`stderr: ${stderr}`);
           }
           console.log(`stdout: ${stdout}`);
         });
  }
  
  public off() {
    exec(`8relay ${this.board} write ${this.channel} off`,
         (error, stdout, stderr) => {
           if (error) {
             console.log(`error: ${error.message}`);
           }
           if (stderr) {
             console.log(`stderr: ${stderr}`);
           }
           console.log(`stdout: ${stdout}`);
         });
  }

  public status() {
    exec(`8relay ${this.board} read ${this.channel}`,
         (error, stdout, stderr) => {
           if (error) {
             console.log(`error: ${error.message}`);
           }
           if (stderr) {
             console.log(`stderr: ${stderr}`);
           }
           this.state = parseInt(stdout);
         });
    return this;
  }
}
