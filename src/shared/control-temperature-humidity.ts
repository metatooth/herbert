import { Clime } from "./clime";
import { ClimeControl } from "./clime-control";
import { PIDController } from "./p-i-d-controller";

export class ControlTemperatureHumidity extends ClimeControl {
  temperature: PIDController;
  humidity: PIDController;

  constructor(targets: [PIDController, PIDController]) {
    super();
    this.temperature = targets[0];
    this.humidity = targets[1];
  }

  control(clime: Clime): [string, string] {
    const result: [string, string] = ["off", "off"];

    const temp = this.temperature.output(clime.temperature);

    if (temp > 0) {
      result[0] = "heat";
    } else {
      result[0] = "cool";
    }

    const humid = this.humidity.output(clime.humidity);

    if (humid < 0) {
      result[1] = "humidify";
    } else {
      result[1] = "dehumidify";
    }

    return result;
  }
}
