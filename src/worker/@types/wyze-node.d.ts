declare module "wyze-node" {
  export interface WyzeDevice {
    nickname: string;
    mac: string;
    conn_state: number;
    device_params: {
      switch_state: number;
    };
  }

  export interface WyzeResult {
    code: number;
    msg: string;
  }

  export default class Wyze {
    constructor(opts: { username: string; password: string });
    turnOff(d: WyzeDevice): WyzeResult;
    turnOn(d: WyzeDevice): WyzeResult;
    getDeviceByMac(mac: string): WyzeDevice;
    getDeviceList(): WyzeDevice[];
  }
}
