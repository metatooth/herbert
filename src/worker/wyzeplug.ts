export class Wyzeplug {
  device: Device;
  wyze: Wyze;

  constructor(device: Device) {
    this.device = device;
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
