import { vaporPressureDeficit } from "../shared/utils";

export class Environment {
  temp: number;
  humidity: number;
  vpd: number;
  tolerance: number;
  mintemp: number;

  /**
   * @constructor
   * @param {number} temp the ambient temperature
   * @param {number} delta on leaf temperature difference
   * @param {number} humidity relative humidity (0.0)
   * @param {number} tolerance for control of vapor pressure deficit
   * @param {number} mintemp the minimum allowed temperature
   */
  constructor(
    temp: number,
    delta: number,
    humidity: number,
    tolerance: number,
    mintemp: number
  ) {
    this.temp = temp;
    this.humidity = humidity;
    this.vpd = vaporPressureDeficit(temp, delta, humidity);
    this.tolerance = tolerance;
    this.mintemp = mintemp;
  }

  check(
    temperature: number,
    delta: number,
    humidity: number
  ): Map<string, boolean> {
    const deficit = vaporPressureDeficit(temperature, delta, humidity);

    const systems = new Map([
      ["heat", false],
      ["cool", false],
      ["humidify", false],
      ["dehumidify", false],
    ]);

    if (temperature < this.mintemp) {
      systems.set("heat", true);
    }

    if (Math.abs(deficit - this.vpd) > this.tolerance) {
      if (deficit < this.vpd) {
        if (temperature < this.temp) {
          systems.set("heat", true);
        }

        if (humidity > this.humidity) {
          systems.set("dehumidify", true);
        }
      } else {
        if (temperature > this.temp) {
          systems.set("cool", true);
        }

        if (humidity < this.humidity) {
          systems.set("humidify", true);
        }
      }
    }

    return systems;
  }
}
