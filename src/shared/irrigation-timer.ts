/**
 * Set a timer for a duty cycle of active seconds per run per day.
 */
export class IrrigationTimer {
  active: number;
  runs: number;

  constructor(runs: number, active: number) {
    this.runs = runs;
    this.active = active;
  }

  isOn(seconds: number): boolean {
    let result = false;
    const cycle = 86400 / this.runs;

    for (let i = 0; i < this.runs; i++) {
      if (seconds >= i * cycle && seconds < i * cycle + this.active) {
        result = true;
      }
    }

    return result;
  }
}
