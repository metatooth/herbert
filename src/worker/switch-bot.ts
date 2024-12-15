export default class SwitchBot {
  noble: null;
  ondiscover: null;
  onadvertisement: null;
  _scanning: false;
  _DEFAULT_DISCOVERY_DURATION: 5000;
  _PRIMARY_SERVICE_UUID: "cba20d00224d11e69fb80002a5d5c51b";

  constructor() {
    this.noble = require("@abandonware/noble");
  }
}
