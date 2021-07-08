export class Meter {
  device: string;
  devicetype: string;
  manufacturer: string;
  nickname: string;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  timestamp: Date;

  constructor(json: string) {
    if (json) {
      const obj = JSON.parse(json);
      this.device = obj["device"];
      this.devicetype = obj["devicetype"];
      this.manufacturer = obj["manufacturer"];
      this.nickname = obj["nickname"];
      this.temperature = parseFloat(obj["temperature"]);
      this.humidity = parseFloat(obj["humidity"]);
      this.pressure = parseFloat(obj["pressure"]);
      this.timestamp = new Date(Date.parse(obj["timestamp"]));
      this.createdat = new Date(Date.parse(obj["createdat"]));
      this.updatedat = new Date(Date.parse(obj["updatedat"]));
      this.deleted = obj["deleted"];
      if (obj["deletedat"]) {
        this.deletedat = new Date(Date.parse(obj["deletedat"]));
      }
    }
  }
}

export class MetersState {
  meters: Meter[];
  error: boolean;

  constructor() {
    this.meters = [];
    this.error = false;
  }
}
