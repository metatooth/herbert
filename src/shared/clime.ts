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
}
