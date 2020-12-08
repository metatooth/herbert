/**
 * Set a timer for a start hour [0-23] and duration (in hours).
 */
export class Timer {
    start: number;
    duration: number;

constructor(start: number, duration: number) {
        this.start = start;
        this.duration = duration;
    }

    isOn(hour: number): boolean {
        let result = false;
        const limit = this.start + this.duration;

        if (limit < 24) {
            if (hour >= this.start && hour < limit) {
                result = true;
            }
        } else {
            if (hour >= this.start && hour < 24) {
                result = true;
            }

            if (hour >= 0 && hour < (limit - 24)) {
                result = true;
            }
        }

        return result;
    }
}
