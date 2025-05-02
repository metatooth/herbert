import { Device } from "./device";
import { AnySocketMessage } from "../shared/types";
import { makeSwitchStatusMessage } from "../shared/message-creators";

export class Switch extends Device {
  public on() {
    this.state = "on";
  }

  public off() {
    this.state = "off";
  }

  public status(): AnySocketMessage {
    return makeSwitchStatusMessage({
      device: this.device,
      manufacturer: this.manufacturer,
      status: this.state,
      timestamp: new Date().toString(),
    });
  }
}
