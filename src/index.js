const Wyze = require('wyze-node');

const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

const wyze = new Wyze(options);

/**
* Toggles on/off the named device.
* @param {string} name
*/
async function toggle(name) {
  console.log(`Toggle ${name} ...`);

  const device = await wyze.getDeviceByName(name);
  const status = await wyze.getDeviceStatus(device);
  console.log(status['switch_state']);
  let result;
  if (status['switch_state'] === 0) {
    result = await wyze.turnOn(name);
  } else {
    result = await wyze.turnOff(name);
  }
  console.log(result);
  console.log('Done.');
}

; (async () => {
  console.log(wyze);

  const devices = await wyze.getDeviceList();
  console.log(devices);

  await toggle('Fan A');
  await toggle('Toaster B');
  await toggle('Lamp C');
  await toggle('Lamp D');
})();
