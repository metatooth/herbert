export default class ThermoPro {
  noble;

  constructor() {
    import noble from "@abandonware/noble";
    this.noble = noble;
  }

  async scan() {
    this.noble.on("stateChange", async state => {
      console.log("state is", state);
      if (state === "poweredOn") {
        console.log("start...");
        await this.noble.startScanningAsync();
        console.log("done.");
      }
    });

    this.noble.on("discover", async peripheral => {
      console.log("discovered", peripheral);

      process.exit(0);
    });
  }
}
