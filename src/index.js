
const Switchbot = require('node-switchbot');
const switchbot = new Switchbot();

const Wyze = require('wyze-node');

const {vpair, vpsat, vpd, rh} = require('./utils');

const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

const wyze = new Wyze(options);

/**
 * Turn off named device
* @param {string} name
*/
async function off(name) {
  console.log(`Turn off ${name} ...`);
  types.get(name).forEach(async (name) => {
    const device = await wyze.getDeviceByName(name);
    const result = await wyze.turnOff(device);
    console.log(result);
    console.log('Done.');
  });
}

/**
 * Turn on named device
* @param {string} name
*/
async function on(name) {
  console.log(`Turn on ${name} ...`);
  types.get(name).forEach(async (name) => {
    const device = await wyze.getDeviceByName(name);
    const result = await wyze.turnOn(device);
    console.log(result);
    console.log('Done.');
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
  console.log('INIT ...');

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
    const lamps = parseInt(process.env.LAMPS) ||  20;

    console.log(`VPD ${vpd}`);
    console.log(`T ${t}`);
    console.log(`DELTA ${delta}`);
    console.log(`INTERVAL ${interval}`);
    console.log(`RH ${rh(vpd, t)}`);
    console.log(`LAMPS ${lamps}`);

    targets.set('VPD', vpd);
    targets.set('T', t);
    targets.set('DELTA', delta);
    targets.set('INTERVAL', interval);
    targets.set('RH', rh(vpd, t));
    targets.set('LAMPS', lamps);

    return switchbot.discover({model: 'T', quick: true}).then((dlist) => {
      types.set('meter', dlist[0]);

      initialized = true;
      console.log('INIT Done.');
    }).catch((error) => {
      console.error(error);
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
    const rh = ad.serviceData.humidity / 100;
    const sat = vpsat(t - targets.get('DELTA'));
    const air = vpair(t, rh);
    const deficit = vpd(t - targets.get('DELTA'), t, rh);
    console.log(`TARGETS ${targets.get('T')}C ${targets.get('RH')} ${targets.get('VPD')}`);
    console.log(`${(new Date()).toISOString()} - ${t}C ${rh} ${sat}kPa ${air}kPa ${deficit}kPa`);

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
      }
    } else {
      if (t > targets.get('T')) {
        // blowers on
        // heaters off
        // AC unit cool
        on('blower');
      }

      if (rh < targets.get('RH')) {
        // dehumidifiers off
        // AC unit dehumidify off
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

  console.log('Check lamps...');
  const sec = (new Date()).getSeconds();
  console.log(`AT ${sec} check ${targets.get('LAMPS')}`);

  if (sec <= targets.get('LAMPS')) {
    on('lamp');
  } else {
    off('lamp');
  }

  console.log('Done lamps.');

  console.log('Start scan...');
  await switchbot.startScan();

  switchbot.onadvertisement = handler;

  await switchbot.wait(5000);

  await switchbot.stopScan();
  console.log('Done scan.');

  setTimeout(app, targets.get('INTERVAL'));
}

setTimeout(app, 0);
