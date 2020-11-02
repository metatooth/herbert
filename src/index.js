const Wyze = require('wyze-node');

const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

const wyze = new Wyze(options);

; (async () => {
  console.log(wyze);

  const devices = await wyze.getDeviceList();
  console.log(devices);

  // Get a Wyze Bulb by name and turn it off.
  let device = await wyze.getDeviceByName('Porch Light');
  const result = await wyze.turnOff(device);
  console.log(result);

  // Get the state of a Wyze Sense contact sensor
  device = await wyze.getDeviceByName('Front Door');
  const state = await wyze.getDeviceState(device);
  console.log(`${device.nickname} is ${state}`);
})();
