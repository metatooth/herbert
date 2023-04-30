const noble = require("@abandonware/noble");

export default class BluetoothLowEnergy {
  onadvertisement: Function;
  _scanning: false;
  _DEFAULT_DISCOVERY_DURATION: 5000;
  _PRIMARY_SERVICE_UUID: "";

  constructor(uuid) {
    this._PRIMARY_SERVICE_UUID = uuid;
  }

  _init() {
    const peripherals = {};
    const timer = null;

    let finishDiscovery;

    const promise = new Promise((resolve, reject) => {
      switch (noble.state) {
        case "poweredOn":
          resolve(true);
          return;
        case "unsupported":
        case "unauthorized":
        case "powerOff":
          reject(
            new Error("Failed to initialize the Noble object: " + noble.state)
          );
          return;
        default:
          noble.once("stateChange", (state) => {
            if (state === "poweredOn") {
              resolve(true);
            } else {
              reject(
                new Error("Failed to initialize the Noble object: " + state)
              );
            }
          });
      }
    });
    return promise;
  }

  startScan() {
    console.log("start this scan");
    const promise = new Promise((resolve, reject) => {
      this._init()
        .then(() => {
          console.log("init done");
          noble.on("discover", (peripheral) => {
            console.log("disovered this", peripheral);
          });

          noble.startScanning([this._PRIMARY_SERVICE_UUID], true, (error) => {
            console.log("got scanning underway");
            if (error) {
              reject(error);
            } else {
              resolve(true);
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  }

  wait(msec) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, msec);
    });
  }

  stopScan() {
    noble.removeAllListeners("discover");
    noble.stopScanning();
  }
}
