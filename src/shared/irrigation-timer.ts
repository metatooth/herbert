/**
 * Set a timer for a duty cycle of active seconds per run per day.
 */
export class IrrigationTimer {
  active: number;
  runs: number;
  total: number;
  max: number;
  offset: number;

  constructor(
    runs: number,
    active: number,
    total: number,
    max: number,
    offset: number
  ) {
    this.runs = runs;
    this.active = active;
    this.total = total;
    this.max = max;
    this.offset = offset;
  }

  isOn(microseconds: number, id: number): boolean {
    let result = false;
    const cycle = 86400000 / this.runs;
    const tranches = Math.ceil(this.total / this.max);

    const now = microseconds - this.offset * 60 * 60 * 1000;

    for (let i = 0; i < tranches; i++) {
      if (id <= (i + 1) * this.max) {
        for (let j = 0; j < this.runs; j++) {
          const start = j * cycle + i * this.active;
          const fin = j * cycle + (i + 1) * this.active;
          if (now >= start && now < fin) {
            result = true;
          }
        }

        break;
      }
    }

    return result;
  }
}
