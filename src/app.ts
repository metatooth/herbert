import * as WebSocket from 'ws';
import * as config from 'config';
import * as fs from 'fs';

import * as utils from './utils';
import { AirDirectives } from './air-directives';
import { BlowerTimer } from './blower-timer';
import { Clime } from './clime';
import { ConstantVpd } from './constant-vpd';
import { GrowLog } from './grow-log';
import { LampTimer } from './lamp-timer';
import { Meter } from './meter';
import { Plug } from './plug';
import { PlugFactory } from './plug-factory';
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
    day: AirDirectives;
    night: AirDirectives;
    lamps: LampTimer;
    blowers: BlowerTimer;
    last: [number, number];
    socket: WebSocket;
    systems: Map<string, boolean>;
    growlog: GrowLog;
    mainMeter: Meter;
    plugs: Map<string, Array<Plug>>;

    private constructor() {
        console.log('process.argv', process.argv);

        if (process.argv.length > 2) {
            const arg = process.argv[2];
            console.log('arg', arg);
            if (arg.match(/^-C/)) {
                console.log('matched -C!');
            }
        }

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

        this.systems = new Map([
            ['blower', false],
            ['dehumidifier', false],
            ['heater', false],
            ['humidifier', false],
            ['lamp', false],
        ]);
        
        this.growlog = new GrowLog('growlog.db');

        const meters: Array<Meter> = config.get('meters');

        meters.forEach((meter: Meter) => {
            logger.debug('METER', meter);
            if (meter.type === 'main') {
                this.mainMeter = new Meter(meter.id);
            }
        });

        this.initialized = false;
    }

    async handler(ad: WoSensorTH): Promise<Map<string, boolean>> {
        const app = App.instance();

        if (ad.id === app.mainMeter.id) {
            logger.debug(`main meter id ${ad.id}`);

            const t = ad.serviceData.temperature.c;
            const h = ad.serviceData.humidity / 100.0;

            logger.debug('curr:', [t, h]);
            logger.debug('last:', app.last);  

            if (app.last[0] !== t || app.last[1] !== h) {
                logger.debug('changed!');

                app.systems.set('heater', false);
                app.systems.set('blower', false);
                app.systems.set('humidifier', false);
                app.systems.set('dehumidifier', false);
                
                app.growlog.track(t, h);

                const hour = (new Date()).getHours();
                let directive: AirDirectives;
                let d: number;

                if (app.lamps.isOn(hour)) {
                    directive = app.day;
                    d = -0.6;
                } else {
                    directive = app.night;
                    d = 0.3;
                }

                directive.clime = new Clime(t, d, h);
                directive.monitor();

                logger.debug(directive);

                if (directive.temperature === 'heat') {
                    app.systems.set('heater', true);
                } else if (directive.temperature === 'cool') {
                    app.systems.set('blower', true);                
                } else {
                    app.systems.set('heater', false);
                }

                if (directive.humidity === 'humidify') {
                    app.systems.set('humidifier', true);
                } else if (directive.humidity === 'dehumidify') {
                    app.systems.set('dehumidifier', true);
                } else {
                    app.systems.set('dehumidifier', false);
                    app.systems.set('humidifier', false);
                }

                app.last[0] = t;
                app.last[1] = h;
            }
        } else {
            logger.debug(`XXX advertisement ${ad.id} XXX`);
        }

        logger.debug(app.systems);

        return app.systems;
    }

    public static instance(): App {
        if (!App._instance) {
            App._instance = new App();
        }
        return App._instance;
    }

    public async init(): Promise<boolean> {
        logger.info('====================================');
        logger.info('Starting up...');

        const factory = new PlugFactory(this.systems);
        await factory.build(config.get('plugs'));
        this.plugs = factory.plugs;
        
        return new Promise((resolve) => {
            logger.info('DAY >>', this.day);
            logger.info('NIGHT >>', this.night);
            logger.info(config);
            logger.info(this.mainMeter);
            logger.info(this.plugs);
            logger.info('====================================');
            this.initialized = true;
            resolve(true);
        });
    }

    public async run(): Promise<boolean> {
        const app = App.instance();
        if (!app.initialized) {
            await app.init();
        }

        const polling: number = 1000 * parseInt(config.get('polling'));
        const interval: number = 1000 * parseInt(config.get('interval'));

        logger.debug('Start scan for %dms ...', polling);
        await app.mainMeter.startScan();
        app.mainMeter.bot.onadvertisement = app.handler;
        await app.mainMeter.wait(polling);
        await app.mainMeter.stopScan();
        logger.debug('Done scan.');

        const now: Date = new Date();
        const hour: number = now.getHours();
        const min: number = now.getMinutes();
        const sec: number = now.getSeconds();

        if (app.lamps.isOn(hour)) {
           app.systems.set('lamp', true);
        } else {
           app.systems.set('lamp', false);
        }

        if (app.blowers.isOn(min * 60 + sec)) {
           app.systems.set('blower', true);
        } else {
           app.systems.set('blower', false);
        }


        logger.debug('Apply systems command to plugs...');
        logger.debug('SYSTEMS', app.systems);
        logger.debug('PLUGS', app.plugs);

        app.plugs.forEach((value: Array<Plug>, key: string) => {
            value.forEach((plug) => {
                if (app.systems.get(key)) {
                    plug.on();
                } else {
                    plug.off();
                }
            });
        });

        logger.debug('Done apply systems command.');

      const data = {
          id: config.get('id'),
            temperature: app.last[0],
            humidity: app.last[1],
          blower: app.systems.get('blower'),
          dehumidifier: app.systems.get('dehumidifier'),
          heater: app.systems.get('heater'),
          humidifier: app.systems.get('humidifier'),
          lamp: app.systems.get('lamp'),
            updated_at: new Date()
        };
        
      logger.debug('Checking app socket...');
      logger.debug('Ready state:', app.socket.readyState);
      logger.debug('Done.');
        
      if (app.socket.readyState !== 1) {
            app.socket = null;
          app.socket = new WebSocket(config.get('ws-url'));
            
          app.socket.on('close', () => {
             logger.debug('THIS SOCKET IS CLOSED');
          });
      } else {
            app.socket.send(JSON.stringify(data));
        }

        logger.debug('Done all. Timeout in %dms.', interval - polling);
        setTimeout(app.run, interval - polling);

        return new Promise((resolve) => {
            resolve(true);
        });
    }
}
