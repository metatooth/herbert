import { IMeterReadingEntry, MeterReading } from "./meter-reading";
const url = process.env.DATABASE_URL;

export function createMeterReading(
  meter: string,
  temperature: number,
  humidity: number
): void {
  console.log("create meter reading");
  console.log(url);
  const mr = new MeterReading(url);
  console.log("meter reading", mr);
  mr.track(meter, temperature, humidity);
}

export async function meterReadings(
  meter: string
): Promise<IMeterReadingEntry[]> {
  const mr = new MeterReading(url);

  const result = await mr.log(meter, 2);

  return new Promise((resolve, reject) => {
    resolve(result[0]);
  });
}
