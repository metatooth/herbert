export class Device {
  device: string;
  devicetype: string;
  manufacturer: string;
  nickname: string;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
  status: string;
  timestamp: Date;

  constructor() {
    this.device = "";
    this.devicetype = "";
    this.manufacturer = "";
    this.nickname = "";
    this.createdat = new Date();
    this.updatedat = new Date();
    this.deleted = false;
  }
}


export class DevicesState {
  devices: Device[];
  error: boolean;

  constructor() {
    this.devices = [];
    this.error = false;
  }
}
