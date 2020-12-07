const log4js = require('log4js');
log4js.configure('./config/log4js.json');
const logger = log4js.getLogger('app');

import * as utils from './utils';

export class Environment {
    temp: number;
    humidity: number;
    vpd: number;
    tolerance: number;

    /**
     * @constructor
     * @param {number} temp the ambient temperature
     * @param {number} delta on leaf temperature difference 
     * @param {number} humidity relative humidity (0.0)
     * @param {number} tolerance for control of vapor pressure deficit 
     */
    constructor(temp: number,
                delta: number,
                humidity: number,
                tolerance: number) {
        this.temp = temp;
        this.humidity = humidity;
        this.vpd = utils.VaporPressureDeficit(temp, delta, humidity);
        this.tolerance = tolerance;
    }

    check(temperature: number, delta: number, humidity: number): any {
        const sat = utils.SaturatedVaporPressure(temperature - delta);
        const air = utils.VaporPressureAir(temperature, humidity);
        const deficit = utils.VaporPressureDeficit(temperature,
                                                   delta,
                                                   humidity);

        logger.info(`TARGET TEMP ${this.temp}.toFixed(1)} C`);
        logger.info(`ACTUAL TEMP ${temperature.toFixed(1)} C`);
        logger.info(`TARGET RH ${this.humidity.toFixed(2)}`);
        logger.info(`ACTUAL RH ${humidity.toFixed(2)}`);
        logger.info(`CALC VPsat ${sat.toFixed(0)} pascals`);
        logger.info(`CALC VPair ${air.toFixed(0)} pascals`);
        logger.info(`TARGET VPd ${this.vpd.toFixed(0)} pascals`);
        logger.info(`CALC VPd ${deficit.toFixed(0)} pascals`);

        const systems = new Map;
        systems.set('heat', false);
        systems.set('cool', false);
        systems.set('humidify', false);
        systems.set('dehumidify', false);

        if (temperature < 15.6) {
            systems.set('heat', true);
        }

        if (Math.abs(deficit - this.vpd) > this.tolerance) {
            if (deficit < this.vpd) {
                if (temperature < this.temp) {
                    systems.set('heat', true);
                }

                if (humidity > this.humidity) {
                    systems.set('dehumidify', true);
                }
            } else {
                if (temperature > this.temp) {
                    systems.set('cool', true);
                }

                if (humidity < this.humidity) {
                    systems.set('humidify', true);
                }
            }
        }

        return systems;
    }
}
