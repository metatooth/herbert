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

import {Clime} from './clime';
import {TargetTempHumidity} from './target-temp-humidity';
import {ConstantVpd} from './constant-vpd';
import {AirDirectives} from './air-directives';

import * as utils from './utils';

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
    day: AirDirectives;
    night: AirDirectives;
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

        this.lamps = new LampTimer(
            parseInt(config.get('environment.lamp.start')),
            parseInt(config.get('environment.lamp.duration'))
        );

        this.blowers = new BlowerTimer(
            parseInt(config.get('environment.blower.active')),
            parseInt(config.get('environment.blower.cycle'))
        );

        if (config.get('environment.strategy') === 'constant-vpd') {
            let vpd = utils.VaporPressureDeficit(
                config.get('environment.lamp-on.temperature'),
                config.get('environment.lamp-on.delta'),
                config.get('environment.lamp-on.humidity'));

            this.day = new AirDirectives(
                new ConstantVpd(
                    [vpd, config.get('environment.vpd-tolerance')]));

            vpd = utils.VaporPressureDeficit(
                config.get('environment.lamp-off.temperature'),
                config.get('environment.lamp-off.delta'),
                config.get('environment.lamp-off.humidity'));
                
            this.night = new AirDirectives(
                new ConstantVpd(
                    [vpd, config.get('environment.vpd-tolerance')]));

        } else {
            this.day = new AirDirectives(
                new TargetTempHumidity([
                    config.get('environment.lamp-on.temperature'),
                    config.get('environment.lamp-on.humidity')]));
            
            this.night = new AirDirectives(
                new TargetTempHumidity([
                    config.get('environment.lamp-off.temperature'),
                    config.get('environment.lamp-off.humidity')]));
        }
    }

    async handler(ad: WoSensorTH): Promise<Map<string, boolean>> {
        const result: Map<string, boolean> = new Map([
            ['heater', false],
            ['blower', false],
            ['humidifier', false],
            ['dehumidifier', false],
        ]);

        if (ad.id === config.get('main-meter')) {
            logger.debug(`main meter id ${ad.id}`);
            
            const t = ad.serviceData.temperature.c;
            const h = ad.serviceData.humidity / 100.0;

            growlog.track(t, h);
            
            const hour = (new Date()).getHours();
            const app = App.instance();
            let directive: AirDirectives;
            let d: number;

            if (app.lamps.isOn(hour)) {
                directive = app.day;
                d = -0.6;
            } else {
                directive = app.night;
                d = 0.6;
            }
            
            directive.clime = new Clime(t, d, h);
            directive.monitor();

            logger.debug(directive);

            if (directive.temperature === 'heat') {
                app.on('heater');
                result.set('heater', true);
            } else if (directive.temperature === 'cool') {
                app.off('heater');
                app.on('blower');
                result.set('blower', true);                
            } else {
                app.off('heater');
            }

            if (directive.humidity === 'humidify') {
                app.off('dehumidifier');
                app.on('humidifier');
                result.set('humidifier', true);
            } else if (directive.humidity === 'dehumidify') {
                app.on('dehumidifier');
                app.off('humidifier');
                result.set('dehumidifier', true);
            } else {
                app.off('dehumidifier');
                app.off('humidifier');
            }
        } else {
            logger.debug('XXX advertisement XXX');
            logger.debug(ad);
            logger.debug('XXX advertisement XXX');
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
                            wyze.getDeviceState(device)
                                .then((state: DeviceState) => {
                                    logger.debug(state);
                                });
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
     * Turn off named devices
     * @param {string} name
     */
    async off(name: string): Promise<boolean> {
        logger.info(`OFF ${name}`);
        this.types.get(name).forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            const result = await wyze.turnOff(device);
            if (result.code !== 1) {
                logger.error(`ERROR ${value} OFF - ${result.msg}`);
            }
        });

        return new Promise((resolve) => {
            resolve(true);
        });
    }

    /**
     * Turn on named devices
     * @param {string} name
     */
    async on(name: string): Promise<boolean> {
        logger.info(`ON ${name}`);
        this.types.get(name).forEach(async (value: string) => {
            const device = await wyze.getDeviceByName(value);
            const result = await wyze.turnOn(device);
            if (result.code !== 1) {
                logger.error(`ERROR ${value} ON - ${result.msg}`);
            }
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
        switchbot.onadvertisement = app.handler;
        const polling: number = 1000 * parseInt(config.get('app.polling'));
        await switchbot.wait(polling);
        await switchbot.stopScan();
        logger.debug('Done scan.');
        
        const interval: number = 1000 * parseInt(config.get('interval'));

        setTimeout(app.run, interval - polling);

        return new Promise((resolve) => {
            resolve(true);
        });
    }
}
