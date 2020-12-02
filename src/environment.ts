const log4js = require('log4js');
log4js.configure('./config/log4js.json');
const logger = log4js.getLogger('app');

import * as utils from './utils';

export class Environment {
    vpd: number;
    air: number;
    leaf: number;
    humidity: number;

    constructor(vpd: number, air: number, leaf: number) {
        this.vpd = vpd;
        this.air = air;
        this.leaf = leaf;

        const sat = utils.SaturatedVaporPressure(this.leaf);
        this.humidity = utils.RelativeHumidity(sat - vpd, this.air);
    }

    check(temperature: number, humidity: number, delta: number): any {
        const sat = utils.SaturatedVaporPressure(temperature - delta);
        const air = utils.VaporPressureAir(temperature, humidity);
        const deficit = utils.VaporPressureDeficit(temperature - delta, temperature, humidity);
        logger.info(`ACTUAL TEMP ${temperature.toFixed(1)}C`);
        logger.info(`ACTUAL RH ${humidity.toFixed(2)}`);
        logger.info(`CALC VPsat ${sat.toFixed(0)} pascals`);
        logger.info(`CALC VPair ${air.toFixed(0)} pascals`);
        logger.info(`CALC VPD ${deficit.toFixed(0)} pascals`);

        const systems = new Map;
        systems.set('heat', false);
        systems.set('cool', false);
        systems.set('humidify', false);
        systems.set('dehumidify', false);

        if (temperature < this.air) {
            logger.debug(`${temperature.toFixed(1)} < ${this.air.toFixed(1)}`);
            systems.set('heat', true);
        }

        if (Math.abs(deficit - this.vpd) > 100) {
            if (deficit < this.vpd) {
                logger.debug(`${deficit.toFixed(1)} < ${this.vpd.toFixed(1)}`);
                if (temperature < this.air) {
                    logger.debug(`${temperature.toFixed(1)} < ${this.air.toFixed(1)}`);
                    systems.set('heat', true);
                }

                if (humidity > this.humidity) {
                    logger.debug(`${humidity.toFixed(2)} > ${this.humidity.toFixed(2)}`);
                    systems.set('dehumidify', true);
                }
            } else {
                logger.debug(`${deficit.toFixed(1)} >= ${this.vpd.toFixed(1)}`);
                if (temperature > this.air) {
                    logger.debug(`${temperature.toFixed(1)} > ${this.air.toFixed(1)}`);
                    systems.set('cool', true);
                }

                if (humidity < this.humidity) {
                    logger.debug(`${humidity.toFixed(2)} < ${this.humidity.toFixed(2)}`);
                    systems.set('humidify', true);
                }
            }
        }

        return systems;
    }
}
