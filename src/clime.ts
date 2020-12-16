import * as utils from './utils';

/**
 * The local climate
 */
export class Clime {
    temperature: number;
    delta: number;
    humidity: number;

    constructor(temperature: number, delta: number, humidity: number) {
        this.temperature = temperature;
        this.delta = delta;
        this.humidity = humidity;
    }

    svp(): number {
        return utils.SaturatedVaporPressure(this.temperature);
    }

    vpd() {
        return utils.VaporPressureDeficit(this.temperature,
                                          this.delta,
                                          this.humidity);
    }
}
