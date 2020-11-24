
const Switchbot = require('node-switchbot');
const switchbot = new Switchbot();

const Wyze = require('wyze-node');

const config = require('config');

console.log(config);

const options = {
  username: config.get('wyze.username') || process.env.USERNAME,
  password: config.get('wyze.password') || process.env.PASSWORD,
};


console.log(options);

const wyze = new Wyze(options);

const {vpair, vpsat, vpd, rh} = require('./utils');
const Timer = require('./timer');

try {
  require('fs').mkdirSync('./log');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
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
async function off(name) {
  logger.info(`OFF ${name}`);
  types.get(name).forEach(async (name) => {
    const device = await wyze.getDeviceByName(name);
    await wyze.turnOff(device);
  });
}

/**
 * Turn on named device
* @param {string} name
*/
async function on(name) {
  logger.info(`ON ${name}`);
  types.get(name).forEach(async (name) => {
    const device = await wyze.getDeviceByName(name);
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

const targets = new Map();

/**
 * Initialize
 */
async function init() {
  logger.info('==============================================');
  logger.info('Starting up.');

  return wyze.getDeviceList().then((dlist) => {
    dlist.forEach((device) => {
      for (const key of types.keys()) {
        if (device.nickname.match(new RegExp(key, 'i'))) {
          const value = types.get(key);
          value.push(device.nickname);
        }
      }
    });

    logger.info(config);
      logger.info(types);

    types.set('timer', new Timer(config.get('environment.lamps-start'),
config.get('environment.lamps-duration')));

    return switchbot.discover({model: 'T', quick: true}).then((dlist) => {
      types.set('meter', dlist[0]);

      initialized = true;
      logger.info('==============================================');
    }).catch((error) => {
      logger.error(error);
    });
  });
}

/**
 * Handler
 * @param {Object} ad advertisement data
 */
async function handler(ad) {
  if (ad.id === types.get('meter').id) {
    const t = ad.serviceData.temperature.c;
    const rh = ad.serviceData.humidity / 100.0;
    const sat = vpsat(t - config.get('environment.delta'));
    const air = vpair(t, rh);
    const deficit = vpd(t - config.get('environment.delta'), t, rh);
    logger.info(`ACTUAL TEMP ${t.toFixed(1)}C`);
logger.info(`ACTUAL RH ${rh.toFixed(2)}`);
logger.info(`ACTUAL VPD ${deficit.toFixed(1)}kPa`);

    const VPD = config.get('environment.vapor-pressure-deficit');
    const T = config.get('environment.temperature');
    const RH = vpd(VPD - config.get('environment.delta'), VPD, T);

    if (deficit < VPD) {
      logger.debug(`${deficit.toFixed(1)} < ${VPD.toFixed(1)}`);
      if (t < T) {
        logger.debug(`${t.toFixed(1)} < ${T.toFixed(1)}`);
        // blower off
        // heater on
        off('blower');
        on('heater');
      }

      if (rh > RH) {
        logger.debug(`${rh.toFixed(2)} > ${RH.toFixed(2)}`);
        // dehumidifiers on
        // AC unit dehumidify on
        on('dehumidifier');
        off('humidifier');
      }
    } else {
      logger.debug(`${deficit.toFixed(1)} >= ${VPD.toFixed(1)}`);
      if (t > T) {
        logger.debug(`${t.toFixed(1)} > ${T.toFixed(1)}`);
        // blowers on
        // heaters off
        // AC unit cool
        on('blower');
        off('heater');
      }

      if (rh < RH) {
        logger.debug(`${rh.toFixed(2)} < ${RH.toFixed(2)}`);
        // dehumidifiers off
        // AC unit dehumidify off
        off('dehumidifier');
        on('humidifier');
      }
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
  logger.debug(JSON.stringify(types.get('timer')));

  if (types.get('timer').isOn(hour)) {
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
