const SwitchBot = require('node-switchbot');
const switchbot = new SwitchBot();

const Wyze = require('wyze-node');

const config = require('config');

console.log(config);

const options = {
    username: config.get('wyze.username') || process.env.USERNAME,
    password: config.get('wyze.password') || process.env.PASSWORD,
};

console.log(options);

const wyze = new Wyze(options);

import * as utils from './utils';
import { Timer } from './timer';
import { GrowLog } from './grow-log';
import { Environment } from './environment';

const growlog = new GrowLog('production.db');

try {
    require('fs').mkdirSync('./log');
} catch (e) {
    if (e.code != 'EEXIST') {
        console.error('Could not set up log directory, error was: ', e);
        process.exit(1);
    }
}

const log4js = require('log4js');
log4js.configure('./config/log4js.json');

const logger = log4js.getLogger('app');

/**
 * Turn off named device
 * @param {string} name
 */
async function off(name: string) {
    logger.info(`OFF ${name}`);
    types.get(name).forEach(async (value: string) => {
        const device = await wyze.getDeviceByName(value);
        await wyze.turnOff(device);
    });
}

/**
 * Turn on named device
 * @param {string} name
 */
async function on(name: string) {
    logger.info(`ON ${name}`);
    types.get(name).forEach(async (value: string) => {
        const device = await wyze.getDeviceByName(value);
        await wyze.turnOn(device);
    });
}

let initialized = false;
const types = new Map([
    ['meter', null],
    ['blower', []],
    ['lamp', []],
    ['heater', []],
    ['humidifier', []],
    ['dehumidifier', []],
    ['AC', []],
]);
const environ = new Environment(
    config.get('environment.vapor-pressure-deficit'),
    config.get('environment.temperature'),
    config.get('environment.temperature') -
        config.get('environment.delta')
);

/**
 * Initialize
 */
async function init() {
    logger.info('====================================');
    logger.info('Starting up.');

    console.log(environ);

    return wyze.getDeviceList().then((dlist: Array<any>) => {
	dlist.forEach((device: any) => {
	    logger.debug(device.nickname);
	    types.forEach((value: any[], key: string, map: Map<string, any[]>) => {
		if (device.nickname.match(
		    new RegExp(`^${config.get('environment.prefix')} ${key}`, 'i'),
		)) {
		    logger.debug('MATCHED!');
		    value.push(device.nickname);
		}
	    });
	});
	
	types.set('timer',
		  [new Timer(
		      config.get('environment.lamps-start'),
		      config.get('environment.lamps-duration'),
		  )]
		 );
	
	logger.info(config);
	logger.info(types);
	
		initialized = true;
		logger.info('====================================');

    });
}

/**
 * Handler
 * @param {object} ad advertisement data
 */
async function handler(ad: any) {
    if (ad.serviceData.model === 'T') {
        const t = ad.serviceData.temperature.c;
        const h = ad.serviceData.humidity / 100.0;

        growlog.track(t, h);
        
        const sat = utils.SaturatedVaporPressure(t - config.get('environment.delta'));
        const air = utils.VaporPressureAir(t, h);
        const deficit = utils.VaporPressureDeficit(t - config.get('environment.delta'), t, h);
        logger.info(`ACTUAL TEMP ${t.toFixed(1)}C`);
        logger.info(`ACTUAL RH ${h.toFixed(2)}`);
        logger.info(`CALC VPsat ${sat.toFixed(2)}kPa`);
        logger.info(`CALC VPair ${air.toFixed(2)}kPa`);
        logger.info(`CALC VPD ${deficit.toFixed(1)}kPa`);

        const systems = environ.check(t, h, config.get('environment.delta'));
        console.log(systems);

        if (systems.get('heat') === true) {
            off('blower');
            on('heater');
        } else if (systems.get('cool') === true) {
            on('blower');
            off('heater');
        }

        if (systems.get('humidify') === true) {
            off('dehumidifier');
            on('humidifier');
        } else if (systems.get('dehumidify') === true) {
            on('dehumidifier');
            off('humidifier');
        }

    }
}

/**
 * The application
 */
async function app() {
    if (!initialized) {
        await init();
    }

    logger.debug('Check lamps...');
    const hour = (new Date()).getHours();
    logger.debug(`Check hour ${hour} ...`);
    logger.debug(JSON.stringify(types.get('timer')[0]));

    if (types.get('timer')[0].isOn(hour)) {
        on('lamp');
    } else {
        off('lamp');
    }

    logger.debug('Done lamps.');

    logger.debug('Start scan ...');

    await switchbot.startScan();

    switchbot.onadvertisement = handler;

    await switchbot.wait(config.get('app.polling'));

    await switchbot.stopScan();
    logger.debug('Done scan.');

    setTimeout(app, config.get('environment.interval'));
}

setTimeout(app, 0);
