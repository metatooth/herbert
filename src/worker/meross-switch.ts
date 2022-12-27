import { Switch } from "./switch";
import { MerossCloudDevice } from "meross-cloud";

export class MerossSwitch extends Switch {
  plug: MerossCloudDevice;
  
  constructor(device: MerossCloudDevice) {
    const uuid = device['dev']['uuid'];
    const mac = uuid.replace(/.{2}/g, '$&:').substring(30, 47);
    super(mac, "MEROSS");
    this.state = '';
    this.plug = device;
    this.plug.getSystemReport((result) => {
      console.log("SYSTEM REPORT", result);
    });
  }

  public async off(): Promise<boolean> {
    console.log("MEROSS OFF!");
    let result = false;
    this.plug.controlToggle(false, (err, res) => {
      console.log("RETURNING FROM OFF");
      this.state = "on";
      result = true;
    });
    
    return Promise.resolve(result);
  }

  public async on(): Promise<boolean> {
    console.log("MEROSS ON!");
    let result = false;
    this.plug.controlToggle(true, (err, res) => {
      console.log("RETURNING FROM ON");
      this.state = "off";
      result = true;
    });
    
    return Promise.resolve(result); 
  }
}
