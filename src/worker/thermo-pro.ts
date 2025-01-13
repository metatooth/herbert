import noble from "noble";

export default class ThermoPro {
  async scan() {
    noble.on("stateChange", async (state) => {
      console.log("state is", state);
      if (state === "poweredOn") {
        console.log("start...");
        await noble.startScanningAsync();
        console.log("done.");
      }
    });

    noble.on("discover", async (peripheral) => {
      console.log("discovered", peripheral);

      process.exit(0);
    });
  }
}
