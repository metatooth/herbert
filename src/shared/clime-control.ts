import { Clime } from "./clime";

export class ClimeControl {
  control(clime: Clime): [string, string] {
    let temp = "off";
    if (clime.temperature < 10) {
      temp = "on";
    }

    let humid = "off";
    if (clime.humidity < 10) {
      humid = "on";
    }
    return [temp, humid];
  }
}
