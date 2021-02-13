import { IMeterReadingEntry, MeterReading } from "./meter-reading";
const path = "meter-readings.db";

export function createMeterReading(
  meter: string,
  temperature: number,
  humidity: number
): void {
  const mr = new MeterReading(path);
  mr.track(meter, temperature, humidity);
}

export async function meterReadings(
  meter: string
): Promise<IMeterReadingEntry[]> {
  const mr = new MeterReading(path);

console.log('get ready for', meter, '1');

  const result = await mr.log(meter, 1);

console.log(result);

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}
