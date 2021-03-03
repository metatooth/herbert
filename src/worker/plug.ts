import { Mockplug } from "./mockplug";
import { Wyzeplug } from "./wyzeplug";

export class Plug {
  bot: any;

  constructor(options: Device) {
    if (options.id === "mock") {
      this.bot = new Mockplug();
    } else {
      this.bot = new Wyzeplug(options);
    }
  }

  public async off() {
    return this.bot.off();
  }

  public async on() {
    return this.bot.on();
  }
}
