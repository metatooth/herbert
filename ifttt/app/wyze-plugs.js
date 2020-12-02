const Wyze = require('wyze-node');

const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

const wyze = new Wyze(options);

module.exports = {

  /**
   * Turn off named device
   * @param {string} name
   */
  off: (async function(name) {
    console.log(`Turn off ${name} ...`);

    const device = await wyze.getDeviceByName(name);
    const result = await wyze.turnOff(device);
    console.log(result);
    console.log('Done.');
  })(),

  /**
 * Turn on named device
* @param {string} name
*/
  on: (async function(name) {
    console.log(`Turn on ${name} ...`);

    const device = await wyze.getDeviceByName(name);
    const result = await wyze.turnOn(device);
    console.log(result);
    console.log('Done.');
  })(),

  /**
 * Get status of plugs
* @return {DeviceList}
 */
  state: (async function() {
    console.log(wyze);

    const devices = await wyze.getDeviceList();
    console.log(devices);

    return devices;
  })(),
};
