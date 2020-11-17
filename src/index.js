const Switchbot = require('node-switchbot');
const switchbot = new Switchbot();

const Wyze = require('wyze-node');

const {vpd, rh} = require('./utils');

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

  const device = await wyze.getDeviceByName(name);
  const result = await wyze.turnOff(device);
  console.log(result);
  console.log('Done.');
}

/**
 * Turn on named device
* @param {string} name
*/
async function on(name) {
  console.log(`Turn on ${name} ...`);

  const device = await wyze.getDeviceByName(name);
  const result = await wyze.turnOn(device);
  console.log(result);
  console.log('Done.');
}

; (async () => {
  console.log(wyze);

  const devices = await wyze.getDeviceList();
  console.log(devices);

  const setVPD = parseFloat(process.env.VPD);
  const setT = parseFloat(process.env.T);
  const delta = parseFloat(process.env.DELTA);

  console.log(`Set VPD ${setVPD}`);
  console.log(`Set T ${setT}`);
  console.log(`Set DELTA ${delta}`);

  const setRH = rh(setVPD, setT);

  console.log(`Set RH ${setRH}`);

  switchbot.discover({model: 'T', quick: false}).then((devices) => {
    const device = devices[0];
    console.log('Found it!');
    console.log(device);
    const T = device.temperature.c;
    const RH = device.humidity / 100;
    console.log(`Reading ${T} and ${RH}`);
    const VPD = vpd(T, RH);

    if (VPD < setVPD) {
      if (T < setT) {
        // blowers off
        // heaters on
        // AC unit heat
      }

      if (RH > setRH) {
        // dehumidifiers on
        // AC unit dehumidify on
      }
    } else {
      if (T > setT) {
        // blowers on
        // heaters off
        // AC unit cool
      }

      if (RH < setRH) {
        // dehumidifiers off
        // AC unit dehumidify off
      }
    };
  }).catch((error) => {
    console.error(error);
  });
})();
