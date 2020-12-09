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

import { BlowerTimer } from './blower-timer';
import { LampTimer } from './lamp-timer';
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
    private static _instance: App;
    initialized: boolean;
    types: Map<string, Array<string>>;
    day: Environment;
    night: Environment;
    lamps: LampTimer;
    blowers: BlowerTimer;

    private constructor() {
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

        this.lamps = new LampTimer(
            parseInt(config.get('environment.lamp-start')),
            parseInt(config.get('environment.lamp-duration'))
        );

        this.blowers = new BlowerTimer(
            parseInt(config.get('blower.active')),
            parseInt(config.get('blower.cycle'))
        );
    }

    async handler(ad: WoSensorTH): Promise<Map<string, boolean>> {
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

            const app = App.instance();

            if (app.lamps.isOn(hour)) {
                systems =
                    app.day.check(t,
                                   config.get('environment.lamp-on.delta'),
                                   h);
            } else {
                systems =
                    app.night.check(t,
                                     config.get('environment.lamp-off.delta'),
                                     h);
            }

            logger.debug(systems);
            
            if (systems.get('heat') === true) {
                app.on('heater');
                result.set('heater', true);
            } else if (systems.get('cool') == true) {
                app.off('heater');
                app.on('blower');
                result.set('blower', true);
            } else {
                app.off('heater');
            }

            if (systems.get('humidify') === true) {
                app.off('dehumidifier');
                app.on('humidifier');
                result.set('humidifier', true);
            } else if (systems.get('dehumidify') === true) {
                app.on('dehumidifier');
                app.off('humidifier');
                result.set('dehumidifier', true);
            } else {
                app.off('dehumidifier');
                app.off('humidifier');
            }
        }

        return result;
    }

    async init(): Promise<boolean> {
        logger.info('====================================');
        logger.info('Starting up.');

        logger.debug('DAY >>');
        logger.debug(this.day);
        logger.debug('NIGHT >>');
        logger.debug(this.night);
        
        const types: Map<string, Array<string>> = this.types;

        return new Promise((resolve) => {
            wyze.getDeviceList().then((dlist: Array<Device>) => {
                dlist.forEach((device: Device) => {
                    logger.debug(device.nickname);
                    const nick: string = device.nickname;
                    const prefix: string = config.get('environment.prefix');
                    types.forEach((value: Array<string>, key: string) => {
                        if (nick.match(new RegExp(`^${prefix} ${key}`, 'i'))) {
                            logger.debug('MATCHED!');
                            logger.debug(device);
                            value.push(device.nickname);
                        }
                    });
                });
                
                logger.info(config);
                logger.info(types);
                
                this.initialized = true;
                logger.info('====================================');
                resolve(true);
            });
        });
    }

    public static instance(): App {
        if (!App._instance) {
            App._instance = new App();
        }
        return App._instance;
    }

    /**
     * Turn off named device
     * @param {string} name
     */
    async off(name: string): Promise<boolean> {
        logger.info(`OFF ${name}`);
        this.types.get(name).forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            const result = wyze.turnOff(device);
            logger.debug(result);
        });

        return new Promise((resolve) => {
            resolve(true);
        });
    }

    /**
     * Turn on named device
     * @param {string} name
     */
    async on(name: string): Promise<boolean> {
        logger.info(`ON ${name}`);
        this.types.get(name).forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            const result = await wyze.turnOn(device);
            logger.debug(result);
        });

        return new Promise((resolve) => {
            resolve(true);
        });
    }

    public async run(): Promise<boolean> {
        const app = App.instance();
        if (app.initialized !== true) {
            await app.init();
        }

        const now: Date = new Date();
        const hour: number = now.getHours();
        const min: number = now.getMinutes();
        const sec: number = now.getSeconds();

        if (app.lamps.isOn(hour)) {
            app.on('lamp');
        } else {
            app.off('lamp');
        }

        if (app.blowers.isOn(min * 60 + sec)) {
            app.on('blower');
        } else {
            app.off('blower');
        }

        logger.debug('Start scan ...');
        await switchbot.startScan();
        logger.debug('step');
        switchbot.onadvertisement = app.handler;
        logger.debug('step');
        const polling: number = 1000 * parseInt(config.get('app.polling'));
        logger.debug(`polling at ${polling}`);
        await switchbot.wait(polling);
        await switchbot.stopScan();
        logger.debug('Done scan.');
        
        const interval: number = 1000 * parseInt(config.get('interval'));

        const tid = setTimeout(app.run, interval - polling);

        logger.debug(`timeout id ${tid}`);

        return new Promise((resolve) => {
            logger.debug('run resolved');
            resolve(true);
        });
    }
}
