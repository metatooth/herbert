import * as utils from './utils';

/**
 * The local climate
 */
export class Clime {
    temperature: number;
    delta: number;
    humidity: number;
    timestamp: Date;
    
    constructor(temperature: number, delta: number, humidity: number) {
        this.temperature = temperature;
        this.delta = delta;
        this.humidity = humidity;
	this.timestamp = new Date();
    }

    svp(): number {
        return utils.SaturatedVaporPressure(this.temperature);
    }

    vpd(): number {
        return utils.VaporPressureDeficit(this.temperature,
                                          this.delta,
                                          this.humidity);
    }
}
