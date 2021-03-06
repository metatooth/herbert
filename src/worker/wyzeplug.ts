import { Switch } from "./switch";
import { Wyze } from "wyze-node";

export class Wyzeplug extends Switch {
  device: WyzeDevice;
  wyze: Wyze;

  constructor(device: WyzeDevice, username: string, password: string) {
    super();

    this.device = device;
    const options = {
      username: username,
      password: password
    };
    this.wyze = new Wyze(options);
  }

  public async off() {
    const result = await this.wyze.turnOff(this.device);
    return new Promise((resolve, reject) => {
      if (result.code !== "1") {
        reject(result);
      } else {
        resolve(result);
      }
    });
  }

  public async on() {
    const result = await this.wyze.turnOn(this.device);
    return new Promise((resolve, reject) => {
      if (result.code !== "1") {
        reject(result);
      } else {
        resolve(result);
      }
    });
  }
}
