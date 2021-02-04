import { Clime } from "./clime";

export class ClimeControl {
  control(clime: Clime): [string, string] {
    console.log(clime);
    return ["off", "off"];
  }
}
