import { vaporPressureDeficit } from "./utils";

/**
 * The local climate
 */
export class Clime {
  temperature: number;
  humidity: number;
  timestamp: Date;

  constructor(temperature: number, humidity: number) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.timestamp = new Date();
  }

  vpd(delta: number): number {
    return vaporPressureDeficit(this.temperature, delta, this.humidity);
  }
}
