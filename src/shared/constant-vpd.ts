import { Clime } from "./clime";
import { ClimeControl } from "./clime-control";

export class ConstantVpd extends ClimeControl {
  target: number;

  constructor(target: number) {
    super();
    this.target = target;
  }

  control(clime: Clime): [string, string] {
    const result: [string, string] = ["off", "off"];
    const vpd: number = clime.vpd();

    if (vpd < this.target) {
      result[0] = "heat";
      result[1] = "dehumidify";
    } else {
      result[0] = "cool";
      result[1] = "humidify";
    }

    return result;
  }
}
