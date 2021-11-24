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
    if (this.devicetype === "heater") {
      return "fire-alt";
    } else if (this.devicetype === "humidifier") {
      return "tint";
    } else if (this.devicetype === "dehumidifier") {
      return "tint-slash";
    } else if (this.devicetype === "lamp") {
      return "lightbulb";
    } else if (this.devicetype === "blower") {
      return "wind";
    } else if (this.devicetype === "cooler") {
      return "snowflake";
    } else if (this.devicetype === "irrigator") {
      return "cloud-rain";
    } else if (this.devicetype === "fan") {
      return "fan";
    }

    return "circle";
  }

  get textClass() {
    if (this.status === "on") {
      return "has-text-success";
    } else if (this.status === "off") {
      return "has-text-warning";
    }

    return "has-text-danger";
  }

  get zone() {
    const found = this.zones.filter(zone => {
      const devices = zone.devices.filter(device => {
        return this.device.device === device.device;
      });
      return devices.length !== 0;
    });

    return found.length !== 0 ? found[0] : null;
  }

  get zoneid() {
    const zone = this.zone;
    if (zone) {
      return zone.id;
    }
    return 0;
  }

  get zonename() {
    const zone = this.zone;
    if (zone) {
      return zone.nickname;
    }
    return "";
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
