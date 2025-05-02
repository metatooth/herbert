import { Switch } from "./switch";
import { MerossCloudDevice } from "meross-cloud";

export class MerossSwitch extends Switch {
  plug: MerossCloudDevice;
  initialized: boolean;

  constructor(device: MerossCloudDevice) {
    const uuid = device["dev"]["uuid"];
    const mac = uuid.replace(/.{2}/g, "$&:").substring(30, 47);
    super(mac, "MEROSS");
    this.state = "";
    this.plug = device;
    this.initialized = false;
  }

  private async init(): Promise<boolean> {
    return Promise.resolve((this.initialized = true));
  }

  public async off(): Promise<boolean> {
    if (this.initialized === false) {
      await this.init();
    }

    console.log("MEROSS OFF!");
    let result = false;
    this.plug.controlToggleX(1, false, (err, res) => {
      console.log("RETURNING FROM OFF");
      console.log("err: " + err, "res: " + JSON.stringify(res));
      this.state = "off";
      result = true;
    });

    return Promise.resolve(result);
  }

  public async on(): Promise<boolean> {
    if (this.initialized === false) {
      await this.init();
    }

    console.log("MEROSS ON!");
    let result = false;
    this.plug.controlToggleX(1, true, (err, res) => {
      console.log("RETURNING FROM ON");
      console.log("err: " + err, "res: " + JSON.stringify(res));
      this.state = "on";
      result = true;
    });

    return Promise.resolve(result);
  }
}
