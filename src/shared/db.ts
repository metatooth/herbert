import { MeterReading } from "./meter-reading";

export function createMeterReading(
  meter: string,
  temperature: number,
  humidity: number
): void {
  const mr = new MeterReading("meter-readings.db");
  mr.track(meter, temperature, humidity);
}
