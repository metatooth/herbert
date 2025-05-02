/**
 * Set a timer for a duty cycle of active seconds per total seconds [0-3600].
 */
export class BlowerTimer {
  active: number;
  cycle: number;

  constructor(active: number, cycle: number) {
    this.active = active;
    this.cycle = cycle;
  }

  isOn(seconds: number): boolean {
    return seconds % this.cycle < this.active;
  }
}
