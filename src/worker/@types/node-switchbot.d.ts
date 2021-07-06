declare module "node-switchbot" {
  export interface WoSensorTH {
    id: string;
    address: string;
    rssi: number;
    serviceData: {
      model: string;
      modelName: string;
      temperature: {
        c: number;
        f: number;
      };
      humidity: number;
      fahrenheit: boolean;
      battery: number;
    };
  }

  export default class Switchbot {
    onadvertisement(ad: WoSensorTH): Promise<boolean>;
    startScan(): void;
    wait(time: number): void;
    stopScan(): void;
  }
}
