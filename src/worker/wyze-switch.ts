import { Switch } from "./switch";

export class WyzeSwitch extends Switch {
  constructor(mac: string) {
    super(mac, "WYZE");
  }

  public async off(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public async on(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
