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
  meter: string,
  last: string
): Promise<IMeterReadingEntry[]> {
  const mr = new MeterReading(path);

  console.log('get ready for', meter, last);

  let span = 1;
  
  if (last === 'day') {
    span = 24;
  } else if (last === 'week') {
    span = 24 * 7;
  } else if (last === 'month') {
    span = 24 * 30;
  } else if (last === 'year') {
    span = 24 * 365;
  }
  
  console.log('span is for', span);

  const result = await mr.log(meter, span);

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}
