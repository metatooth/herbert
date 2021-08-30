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
}

export class DevicesState {
  devices: Device[];
  error: boolean;

  constructor() {
    this.devices = [];
    this.error = false;
  }
}
