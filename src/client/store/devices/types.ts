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

  constructor(json: object) {
    this.device = json["device"];
    this.devicetype = json["devicetype"];
    this.manufacturer = json["manufacturer"];
    this.nickname = json["nickname"];
    this.status = json["status"];
    this.timestamp = new Date(Date.parse(json["timestamp"]));
    this.createdat = new Date(Date.parse(json["createdat"]));
    this.updatedat = new Date(Date.parse(json["updatedat"]));
    this.deleted = json["deleted"];
    if (json["deletedat"]) {
      this.deletedat = new Date(Date.parse(json["deletedat"]));
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
