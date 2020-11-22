const Switchbot = require('node-switchbot');
const switchbot = new Switchbot();

const Wyze = require('wyze-node');

const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

const wyze = new Wyze(options);

const {vpair, vpsat, vpd, rh} = require('./utils');
const Timer = require('./timer');

const log4js = require('log4js');
log4js.configure({
  appenders: {cannabis: {type: 'file', filename: 'cannabis.log'}},
  categories: {default: {appenders: ['cannabis'], level: 'trace'}},
});

const logger = log4js.getLogger('cannabis');

/**
 * Turn off named device
* @param {string} name
*/
async function off(name) {
  logger.trace(`Turn off ${name} ...`);
  types.get(name).forEach(async (name) => {
    const device = await wyze.getDeviceByName(name);
    const result = await wyze.turnOff(device);
    logger.trace(result);
    logger.trace('Done.');
  });
}

/**
 * Turn on named device
* @param {string} name
*/
async function on(name) {
  logger.trace(`Turn on ${name} ...`);
  types.get(name).forEach(async (name) => {
    const device = await wyze.getDeviceByName(name);
    const result = await wyze.turnOn(device);
    logger.trace(result);
    logger.trace('Done.');
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
  logger.trace('INIT ...');

  return wyze.getDeviceList().then((dlist) => {
    dlist.forEach((device) => {
      for (const key of types.keys()) {
        if (device.nickname.match(new RegExp(key, 'i'))) {
          const value = types.get(key);
          value.push(device.nickname);
        }
      }
    });

    const vpd = parseFloat(process.env.VPD) || 9.2;
    const t = parseFloat(process.env.T) || 22.0;
    const delta = parseFloat(process.env.DELTA) || 1.0;
    const interval = parseInt(process.env.INTERVAL) || 30000;
    const start = parseInt(process.env.LAMPS_START) || 12;
    const duration = parseInt(process.env.LAMPS_DURATION) || 8;

    logger.info(`VPD ${vpd}kPa`);
    logger.info(`T ${t}C`);
    logger.info(`LEAF DELTA ${delta}C`);
    logger.info(`INTERVAL ${interval}ms`);
    logger.info(`RH ${rh(vpd, t).toFixed(2)}%`);
    logger.info(`LAMPS START ${start}:00`);
    logger.info(`LAMPS DURATION ${duration}hr`);

    targets.set('VPD', vpd);
    targets.set('T', t);
    targets.set('DELTA', delta);
    targets.set('INTERVAL', interval);
    targets.set('RH', rh(vpd, t));

    types.set('timer', new Timer(start, duration));

    return switchbot.discover({model: 'T', quick: true}).then((dlist) => {
      types.set('meter', dlist[0]);

      initialized = true;
      logger.trace('INIT Done.');
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
    const sat = vpsat(t - targets.get('DELTA'));
    const air = vpair(t, rh);
    const deficit = vpd(t - targets.get('DELTA'), t, rh);
    logger.info(`TARGET ${targets.get('T').toFixed(1)}C ${targets.get('RH').toFixed(2)} ${targets.get('VPD').toFixed(2)}kPa`);
    logger.info(`ACTUAL ${t.toFixed(1)}C ${rh.toFixed(2)} ${deficit.toFixed(2)}kPa`);

    if (deficit < targets.get('VPD')) {
      if (t < targets.get('T')) {
        // blower off
        // heater on
        off('blower');
        on('heater');
      }

      if (rh > targets.get('RH')) {
        // dehumidifiers on
        // AC unit dehumidify on
        on('dehumidifier');
        off('humidifier');
      }
    } else {
      if (t > targets.get('T')) {
        // blowers on
        // heaters off
        // AC unit cool
        on('blower');
        off('heater');
      }

      if (rh < targets.get('RH')) {
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

  logger.trace('Check lamps...');
  const hour = (new Date()).getHours();
  logger.trace(`Check hour ${hour} ...`);
  logger.trace(JSON.stringify(types.get('timer')));

  if (types.get('timer').isOn(hour)) {
    on('lamp');
  } else {
    off('lamp');
  }

  logger.trace('Done lamps.');

  logger.trace('Start scan ...');

  await switchbot.startScan();

  switchbot.onadvertisement = handler;

  await switchbot.wait(5000);

  await switchbot.stopScan();
  logger.trace('Done scan.');

  setTimeout(app, targets.get('INTERVAL'));
}

setTimeout(app, 0);
