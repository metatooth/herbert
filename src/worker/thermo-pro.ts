import noble from "@abandonware/noble";

export class ThermoPro {
  scanner;

  constructor() {
    this.scanner = noble;
  }

  async scan() {
    console.log("scan?");

    this.scanner.on("stateChange", async (state) => {
      console.log("state is", state);
      if (state === "poweredOn") {
        console.log("start...");
        await this.scanner.startScanningAsync();
        console.log("done.");
      }
    });

    this.scanner.on("discover", async (peripheral) => {
      console.log("discovered", peripheral);
      await this.scanner.stopScanningAsync();

      process.exit(0);
    });
  }
}
