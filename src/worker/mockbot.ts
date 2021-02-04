const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Mockbot {
  onadvertisement: any;

  public async startScan(): Promise<boolean> {
    return true;
  }

  public async wait(ms: number): Promise<boolean> {
    wait(ms / 2);

    const now = new Date().getTime();
    const temp = 23.9 + Math.sin((2 * 3.14 * now) / 360);
    const humidity = 55 + 2 * Math.cos((2 * 3.14 * now) / 360);

    const ad = {
      id: "mock",
      address: "mock",
      rssi: -125,
      serviceData: {
        model: "T",
        modelName: "WoSensorTH",
        temperature: {
          c: temp,
          f: (temp * 9) / 5 + 32,
        },
        fahrenheit: false,
        humidity: humidity,
        battery: 100,
      },
    };

    await this.onadvertisement(ad);

    return true;
  }

  public async stopScan(): Promise<boolean> {
    return true;
  }
}
