import * as Switchbot from 'node-switchbot';
import * as WebSocket from 'ws';
import * as Wyze from 'wyze-node';
import * as config from 'config';
import * as fs from 'fs';

import * as utils from './utils';
import { AirDirectives } from './air-directives';
import { BlowerTimer } from './blower-timer';
import { Clime } from './clime';
import { ConstantVpd } from './constant-vpd';
import { GrowLog } from './grow-log';
import { LampTimer } from './lamp-timer';
import { TargetTempHumidity } from './target-temp-humidity';

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
    last: [number, number];
    socket: WebSocket;
    systems: Map<string, boolean>;
    growlog: GrowLog;
    wyze: any;

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

        this.last = [-1, -1];

        this.socket = new WebSocket(config.get('ws-url'));

        this.socket.on('open', () => {
            const data = {
                id: config.get('id'),
                started_at: new Date()
            };

            this.socket.send(JSON.stringify(data));
        });

        this.systems = new Map([
            ['heater', false],
            ['blower', false],
            ['humidifier', false],
            ['dehumidifier', false],
        ]);

        this.growlog = new GrowLog(process.env.NODE_ENV + '.db');

        const options = {
            username: config.get('wyze.username') || process.env.USERNAME,
            password: config.get('wyze.password') || process.env.PASSWORD,
        };

        this.wyze = new Wyze(options);
    }

    async handler(ad: WoSensorTH): Promise<Map<string, boolean>> {
        if (ad.id === config.get('main-meter')) {
            logger.debug(`main meter id ${ad.id}`);
            logger.debug(ad);

            const app = App.instance();

            app.systems.set('heater', false);
            app.systems.set('blower', false);
            app.systems.set('humidifier', false);
            app.systems.set('dehumidifier', false);

            logger.debug(app.systems);

            const t = ad.serviceData.temperature.c;
            const h = ad.serviceData.humidity / 100.0;

            logger.debug('curr temp:', t);
            logger.debug('curr humidity:', h);

            logger.debug('last:', app.last);	

            logger.debug('last temp:', app.last[0]);
            logger.debug('last humidity:', app.last[1]);

            if (app.last[0] !== t || app.last[1] !== h) {
                app.growlog.track(t, h);
               
                const data = {
                    id: config.get('id'),
                    temperature: t,
                    humidity: h,
                    updated_at: new Date()
                };

                app.socket.send(JSON.stringify(data));

                const hour = (new Date()).getHours();
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
                    app.systems.set('heater', true);
                } else if (directive.temperature === 'cool') {
                    app.off('heater');
                    app.on('blower');
                    app.systems.set('blower', true);                
                } else {
                    app.off('heater');
                }

                if (directive.humidity === 'humidify') {
                    app.off('dehumidifier');
                    app.on('humidifier');
                    app.systems.set('humidifier', true);
                } else if (directive.humidity === 'dehumidify') {
                    app.on('dehumidifier');
                    app.off('humidifier');
                    app.systems.set('dehumidifier', true);
                } else {
                    app.off('dehumidifier');
                    app.off('humidifier');
                }

                app.last[0] = t;
                app.last[1] = h;
            }
        } else {
            logger.debug('XXX advertisement XXX');
            logger.debug(ad);
            logger.debug('XXX advertisement XXX');
        }

        return this.systems;
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
            this.wyze.getDeviceList().then((dlist: Array<Device>) => {
                dlist.forEach((device: Device) => {
                    logger.debug(device.nickname);
                    const nick: string = device.nickname;
                    const id: string = config.get('id');
                    types.forEach((value: Array<string>, key: string) => {
                        if (nick.match(new RegExp(`^${id} ${key}`, 'i'))) {
                            logger.debug('MATCHED!');
                            logger.debug(device);
                            this.wyze.getDeviceState(device)
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
    private async off(name: string): Promise<boolean> {
        logger.info(`OFF ${name}`);
        this.types.get(name).forEach(async (value: string) => {
            const device = await this.wyze.getDeviceByName(value);
            const result = await this.wyze.turnOff(device);
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
    private async on(name: string): Promise<boolean> {
        logger.info(`ON ${name}`);
        this.types.get(name).forEach(async (value: string) => {
            const device = await this.wyze.getDeviceByName(value);
            const result = await this.wyze.turnOn(device);
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


        const polling: number = 1000 * parseInt(config.get('polling'));
        const interval: number = 1000 * parseInt(config.get('interval'));

        const switchbot = new Switchbot();

        logger.debug('Start scan ...');
        await switchbot.startScan();
        switchbot.onadvertisement = app.handler;
        await switchbot.wait(polling);
        await switchbot.stopScan();
        logger.debug('Done scan.');
        

        setTimeout(app.run, interval - polling);

        return new Promise((resolve) => {
            resolve(true);
        });
    }
}
