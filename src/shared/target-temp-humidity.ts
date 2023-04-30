import { Clime } from "./clime";
import { ClimeControl } from "./clime-control";

export class TargetTempHumidity extends ClimeControl {
  temp: number;
  humidity: number;

  constructor(targets: [string, string]) {
    super();
    console.log("target temp humidity", targets);
    this.temp = +targets[0];
    this.humidity = +targets[1];
  }

  control(clime: Clime): [string, string] {
    const result: [string, string] = ["off", "off"];
    if (clime.temperature < this.temp) {
      result[0] = "heat";
    } else if (clime.temperature > this.temp) {
      result[0] = "cool";
    }

    if (clime.humidity < this.humidity) {
      result[1] = "humidify";
    } else if (clime.humidity > this.humidity) {
      result[1] = "dehumidify";
    }

    return result;
  }
}
