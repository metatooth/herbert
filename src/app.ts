const SwitchBot = require('node-switchbot');
const switchbot = new SwitchBot();
const Wyze = require('wyze-node');
const config = require('config');
const options = {
    username: config.get('wyze.username') || process.env.USERNAME,
    password: config.get('wyze.password') || process.env.PASSWORD,
};
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

export class App {
    initialized: boolean;
    types: Map<string, Array<any>>;
    day: any;
    night: any;

    constructor() {
        this.initialized = false;
        this.types = new Map([
            ['meter', []],
            ['blower', []],
            ['lamp', []],
            ['heater', []],
            ['humidifier', []],
            ['dehumidifier', []],
            ['AC', []],
        ]);

        this.day = new Environment(
            config.get('environment.lamp-on.temperature'),
            config.get('environment.lamp-on.delta'),
            config.get('environment.lamp-on.humidity'),
            config.get('vpd-tolerance')
        );

        this.night = new Environment(
            config.get('environment.lamp-off.temperature'),
            config.get('environment.lamp-off.delta'),
            config.get('environment.lamp-off.humidity'),
            config.get('vpd-tolerance')
        );
    }

    /**
     * Handler
     * @param {object} ad advertisement data
     */
    async handler(ad: any): any {
        const handled: Map = { 
            'heater': 'off',
            'humidifier': 'off',
            'dehumidifier': 'off'
        };

        if (ad.serviceData.model === 'T') {
            logger.debug(`id ${ad.id}`);
            const t = ad.serviceData.temperature.c;
            const h = ad.serviceData.humidity / 100.0;

            growlog.track(t, h);
            
            const hour = (new Date()).getHours();
            let systems = null;

            if (this.types.get('timer')[0].isOn(hour)) {
                systems =
                    this.day.check(t,
                                   config.get('environment.lamp-on.delta'),
                                   h);
            } else {
                systems =
                    this.night.check(t,
                                     config.get('environment.lamp-off.delta'),
                                     h);
            }

            logger.debug(systems);
            
            if (systems.get('heat') === true) {
                this.on('heater');
                handled.set('heater', 'on');
            } else {
                this.off('heater');
            }

            if (systems.get('humidify') === true) {
                this.off('dehumidifier');
                this.on('humidifier');
                handled.set('humidifier', 'on');
            } else if (systems.get('dehumidify') === true) {
                this.on('dehumidifier');
                this.off('humidifier');
                handled.set('dehumidifier', 'on');
            } else {
                this.off('dehumidifier');
                this.off('humidifier');
            }
        }

        return handled;
    }

    async init(): Promise<any> {
        logger.info('====================================');
        logger.info('Starting up.');

        logger.debug('DAY >>');
        logger.debug(this.day);
        logger.debug('NIGHT >>');
        logger.debug(this.night);
        
        const promises: Array<any> = [];
        const scope: any = this;

	      scope.types.set('timer',
		                    [new Timer(
		                        config.get('environment.lamp-start'),
		                        config.get('environment.lamp-duration'),
		                    )]
		                   );
	              
        wyze.getDeviceList().then((dlist: Array<any>) => {
	          dlist.forEach((device: any) => {
	              logger.debug(device.nickname);
	              scope.types.forEach((value: any[], key: string, map: Map<string, any[]>) => {
		                if (device.nickname.match(
		                    new RegExp(`^${config.get('environment.prefix')} ${key}`, 'i'),
		                )) {
		                    logger.debug('MATCHED!');
                        logger.debug(device);
		                    value.push(device.nickname);
		                }
                    promises.push(device.nickname);
	              });
	          });
	          
	          logger.info(config);
	          logger.info(scope.types);
	          
		        this.initialized = true;
		        logger.info('====================================');
            promises.push(this.initialized);            
        });

        return Promise.all(promises);
    }

    /**
     * Turn off named device
     * @param {string} name
     */
    async off(name: string): any {
        logger.info(`OFF ${name}`);
        const promises: Array<any> = [];
        this.types.get(name).forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            promises.push(wyze.turnOff(device));
        });
        return Promise.all(promises).then(() => {
            return {name: "off"};
        });
    }

    /**
     * Turn on named device
     * @param {string} name
     */
    async on(name: string): any {
        logger.info(`ON ${name}`);
        const promises: Array<any> = [];
        this.types.get(name).forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            promises.push(wyze.turnOn(device));
        });
        return Promise.all(promises).then(() => {
            return {name: "on"};
        });
    }

    async run(): Promise<any> { 
        if (!this.initialized) {
            await this.init();
        }

        const hour = (new Date()).getHours(); 
       
        if (this.types.get('timer')[0].isOn(hour)) {
            this.on('lamp');
        } else {
            this.off('lamp');
        }

        const scope = this;        
        this.types.get('blower').forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            const state = await wyze.getDeviceState(device);
            console.log(`${device.nickname} is ${state}`); 
            if (state === 'on') {
                scope.off(value);
            } else {
                scope.on(value);
            }
        });

        logger.debug('Start scan ...');

        await switchbot.startScan();

        switchbot.onadvertisement = this.handler;

        await switchbot.wait(config.get('app.polling'));

        await switchbot.stopScan();

        logger.debug('Done scan.');
        
        let dwell: number;
        dwell = config.get('environment.interval') - config.get('app.polling');

        setTimeout(this.run, dwell);
    }
}
