export class Wyzeplug {
  device: any;
  wyze: any;

  constructor(device: Device) {
    this.device = device;
  }

  public async off(): Promise<any> {
    const result = await this.wyze.turnOff(this.device);
    return new Promise((resolve, reject) => {
      if (result.code !== "1") {
        reject(result);
      } else {
        resolve(result);
      }
    });
  }

  public async on(): Promise<any> {
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
