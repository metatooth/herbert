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

  get name() {
    return this.nickname || this.device.slice(9);
  }

  get zone() {
    const found = this.zones.filter(zone => {
      const meters = zone.meters.filter(meter => {
        return this.meter.device === meter.device;
      });
      return meters.length !== 0;
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

export class MetersState {
  meters: Meter[];
  error: boolean;

  constructor() {
    this.meters = [];
    this.error = false;
  }
}
