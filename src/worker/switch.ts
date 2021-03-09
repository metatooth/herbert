import { Device } from "./device";

export class Switch extends Device {
  public async off(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public async on(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
