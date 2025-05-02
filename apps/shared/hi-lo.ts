import { Clime } from "./clime";
import { ClimeControl } from "./clime-control";

export class HiLo extends ClimeControl {
  hitemperature: number;
  lotemperature: number;
  hihumidity: number;
  lohumidity: number;

  constructor(targets: [number, number, number, number]) {
    super();
    this.hitemperature = targets[0];
    this.lotemperature = targets[1];
    this.hihumidity = targets[2];
    this.lohumidity = targets[3];
  }

  control(clime: Clime): [string, string] {
    const result: [string, string] = ["off", "off"];
    if (clime.temperature < this.lotemperature) {
      result[0] = "heat";
    } else if (clime.temperature > this.hitemperature) {
      result[0] = "cool";
    }

    if (clime.humidity < this.lohumidity) {
      result[1] = "humidify";
    } else if (clime.humidity > this.hihumidity) {
      result[1] = "dehumidify";
    }

    return result;
  }
}
