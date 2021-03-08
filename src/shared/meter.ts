import Switchbot from "node-switchbot";

import { Mockbot } from "./mockbot";

export class Meter {
  id: string;
  type: string;
  bot;

  constructor(id: string) {
    this.id = id;

    if (this.id === "mock") {
      this.id = Math.random()
        .toString(16)
        .substr(2, 12); // 6de5ccda
      this.type = "mockbot";
      this.bot = new Mockbot(this.id);
    } else {
      this.type = "SwitchBot";
      this.bot = new Switchbot();
    }
  }

  public async startScan(): Promise<boolean> {
    return this.bot.startScan();
  }

  public async wait(ms: number): Promise<boolean> {
    return this.bot.wait(ms);
  }

  public async stopScan(): Promise<boolean> {
    return this.bot.stopScan();
  }
}
