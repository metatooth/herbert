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

  constructor(json: string) {
    const obj = JSON.parse(json);
    this.device = obj["device"];
    this.devicetype = obj["devicetype"];
    this.manufacturer = obj["manufacturer"];
    this.nickname = obj["nickname"];
    this.status = obj["status"];
    this.timestamp = new Date(Date.parse(obj["timestamp"]));
    this.createdat = new Date(Date.parse(obj["createdat"]));
    this.updatedat = new Date(Date.parse(obj["updatedat"]));
    this.deleted = obj["deleted"];
    if (obj["deletedat"]) {
      this.deletedat = new Date(Date.parse(obj["deletedat"]));
    }
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
