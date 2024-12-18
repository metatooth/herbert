import { Clime } from "./clime";
import { ClimeControl } from "./clime-control";

export class ConstantVpd extends ClimeControl {
  target: number;
  tolerance: number;

  constructor(targets: [number, number]) {
    super();
    this.target = targets[0];
    this.tolerance = targets[1];
  }

  control(clime: Clime): [string, string] {
    const result: [string, string] = ["off", "off"];
    const vpd: number = clime.vpd();
    if (Math.abs(vpd - this.target) > this.tolerance) {
      if (vpd < this.target) {
        result[0] = "heat";
        result[1] = "dehumidify";
      } else {
        result[0] = "cool";
        result[1] = "humidify";
      }
    }

    return result;
  }
}
