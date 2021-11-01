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

  get name() {
    return this.nickname || this.device.slice(12);
  }

  get icon() {
    if (this.device.devicetype === "heater") {
      return "fire-alt";
    } else if (this.device.devicetype === "humidifier") {
      return "tint";
    } else if (this.device.devicetype === "dehumidifier") {
      return "tint-slash";
    } else if (this.device.devicetype === "lamp") {
      return "lightbulb";
    } else if (this.device.devicetype === "blower") {
      return "wind";
    } else if (this.device.devicetype === "cooler") {
      return "snowflake";
    } else if (this.device.devicetype === "irrigator") {
      return "cloud-rain";
    } else if (this.device.devicetype === "fan") {
      return "fan";
    }

    return "circle";
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
