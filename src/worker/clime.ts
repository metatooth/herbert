import { saturatedVaporPressure, vaporPressureDeficit } from "../shared/utils";

/**
 * The local climate
 */
export class Clime {
  temperature: number;
  delta: number;
  humidity: number;
  timestamp: Date;

  constructor(temperature: number, delta: number, humidity: number) {
    this.temperature = temperature;
    this.delta = delta;
    this.humidity = humidity;
    this.timestamp = new Date();
  }

  svp(): number {
    return saturatedVaporPressure(this.temperature);
  }

  vpd(): number {
    return vaporPressureDeficit(this.temperature, this.delta, this.humidity);
  }
}
