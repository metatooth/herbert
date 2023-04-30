export default class ThermoPro {
  noble;

  constructor() {
    this.noble = require("@abandonware/noble");
  }

  async scan() {
    this.noble.on("stateChange", async (state) => {
      console.log("state is", state);
      if (state === "poweredOn") {
        console.log("start...");
        await this.noble.startScanningAsync();
        console.log("done.");
      }
    });

    this.noble.on("discover", async (peripheral) => {
      console.log("discovered", peripheral);

      process.exit(0);
    });
  }
}
