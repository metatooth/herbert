import * as fs from 'fs';

import * as config from 'config';


import * as Switchbot from 'node-switchbot';
const switchbot = new Switchbot;

import * as Wyze from 'wyze-node';

const options = {
    username: config.get('wyze.username') || process.env.USERNAME,
    password: config.get('wyze.password') || process.env.PASSWORD,
};

const wyze = new Wyze(options);

import { Timer } from './timer';
import { GrowLog } from './grow-log';
import { Environment } from './environment';

const growlog: GrowLog = new GrowLog(process.env.NODE_ENV + '.db');

try {
    fs.mkdirSync('./log');
} catch (e) {
    if (e.code != 'EEXIST') {
        console.error('Could not set up log directory, error was: ', e);
        process.exit(1);
    }
}

import * as log4js from 'log4js';
log4js.configure('./config/log4js.json');

const logger = log4js.getLogger('app');

export class App {
    initialized: boolean;
    types: Map<string, Array<string>>;
    day: Environment;
    night: Environment;
    timer: Timer;

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

        this.timer = new Timer(
            parseInt(config.get('environment.lamp-start')),
            parseInt(config.get('environment.lamp-duration'))
        );
    }

    async handler(ad: any): Promise<Map<string, boolean>> {
        const result: Map<string, boolean> = new Map([
            ['heater', false],
            ['blower', false],
            ['humidifier', false],
            ['dehumidifier', false],
        ]);

        if (ad.serviceData.model === 'T') {
            logger.debug(`id ${ad.id}`);
            const t = ad.serviceData.temperature.c;
            const h = ad.serviceData.humidity / 100.0;

            growlog.track(t, h);
            
            const hour = (new Date()).getHours();
            let systems = null;

            if (this.timer.isOn(hour)) {
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
                result.set('heater', true);
            } else if (systems.get('cool') == true) {
                this.off('heater');
                this.on('blower');
                result.set('blower', true);
            } else {
                this.off('heater');
            }

            if (systems.get('humidify') === true) {
                this.off('dehumidifier');
                this.on('humidifier');
                result.set('humidifier', true);
            } else if (systems.get('dehumidify') === true) {
                this.on('dehumidifier');
                this.off('humidifier');
                result.set('dehumidifier', true);
            } else {
                this.off('dehumidifier');
                this.off('humidifier');
            }
        }

        return result;
    }

    async init(): Promise<Array<string>> {
        logger.info('====================================');
        logger.info('Starting up.');

        logger.debug('DAY >>');
        logger.debug(this.day);
        logger.debug('NIGHT >>');
        logger.debug(this.night);
        
        const promises: Array<string> = [];
        const types: Map<string, Array<string>> = this.types;

        wyze.getDeviceList().then((dlist: Array<any>) => {
            dlist.forEach((device: any) => {
                logger.debug(device.nickname);
                const nick: string = device.nickname;
                const prefix: string = config.get('environment.prefix');
                types.forEach((value: Array<string>, key: string) => {
                    if (nick.match(new RegExp(`^${prefix} ${key}`, 'i'))) {
                        logger.debug('MATCHED!');
                        logger.debug(device);
                        value.push(device.nickname);
                    }
                    promises.push(device.nickname);
                });
            });

            logger.info(config);
            logger.info(types);

            this.initialized = true;
            logger.info('====================================');
            promises.push("initialized");
        });

        return Promise.all(promises);
    }

    /**
     * Turn off named device
     * @param {string} name
     */
    async off(name: string): Promise<[string, string]> {
        logger.info(`OFF ${name}`);
        const promises: Array<any> = [];
        this.types.get(name).forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            wyze.turnOff(device).then((result: any) => {
                promises.push(result);
            });
        });
        return Promise.all(promises).then(() => {
            return new Promise((resolve) => {
                resolve([name, "off"]);
            });
        });
    }

    /**
     * Turn on named device
     * @param {string} name
     */
    async on(name: string): Promise<[string, string]> {
        logger.info(`ON ${name}`);
        const promises: Array<any> = [];
        this.types.get(name).forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            wyze.turnOn(device).then((result: any) => {
                promises.push(result);
            });
        });
        return Promise.all(promises).then(() => {
            return new Promise((resolve) => {
                resolve([name, "on"]);
            });
        });
    }

    async run(): Promise<boolean> {
        if (!this.initialized) {
            await this.init();
        }

        const now: Date = new Date();

        logger.debug(`time now is ${now}`);

        const hour: number = now.getHours();

        if (this.timer.isOn(hour)) {
            this.on('lamp');
        } else {
            this.off('lamp');
        }

        const min: number = now.getMinutes();
        const sec: number = now.getSeconds();

        const remainder: number = (min * 60 + sec) %
            parseInt(config.get('blower.cycle'));

        logger.debug(`${(min * 60 + sec)} ${config.get('blower.cycle')} ${remainder}`);

        this.types.get('blower').forEach(async (value: string) => {
            if (remainder > parseInt(config.get('blower.active'))) {
                this.off(value);
            } else {
                this.on(value);
            }
        });

        logger.debug('Start scan ...');
        await switchbot.startScan();

        switchbot.onadvertisement = this.handler;

        const polling: number = 1000 * parseInt(config.get('app.polling'));
        await switchbot.wait(polling);
        await switchbot.stopScan();
        logger.debug('Done scan.');
        
        const interval: number = 1000 *
            parseInt(config.get('environment.interval'));

        setTimeout(this.run, interval - polling);

        return new Promise(() => {
            return true;
        });
    }
}
