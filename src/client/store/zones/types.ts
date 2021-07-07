import { Device } from "@/store/devices/types";
import { Meter } from "@/store/meters/types";
import { Profile } from "@/store/profiles/types";
import { LampTimer } from "../../../shared/lamp-timer";
import { vaporPressureDeficit } from "../../../shared/utils";

export class Zone {
  id: number;
  nickname: string;
  profileid?: number;
  profile?: Profile;
  devices: Device[];
  meters: Meter[];
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
  active: boolean;

  constructor() {
    this.id = 0;
    this.nickname = "";
    this.devices = [];
    this.meters = [];
    this.createdat = new Date();
    this.updatedat = new Date();
    this.deleted = false;
    this.active = true;
  }

  isDay(timestamp: Date): boolean {
    let day = true;

    if (this.profile) {
      const start = this.profile.lampstart.split(":");
      const duration = this.profile.lampduration["hours"];

      const lamp = new LampTimer(parseInt(start[0]), duration);

      const hour = timestamp.getHours();
      day = lamp.isOn(hour);
    }

    return day;
  }

  targetTemperature(ts: Date): number {
    let target = 20;
    if (this.profile) {
      target = this.isDay(ts)
        ? this.profile.lampontemperature
        : this.profile.lampofftemperature;
    }

    return target;
  }

  targetHumidity(ts: Date): number {
    let target = 35;
    if (this.profile) {
      target = this.isDay(ts)
        ? this.profile.lamponhumidity
        : this.profile.lampoffhumidity;
    }

    return target;
  }

  targetPressure(ts: Date): number {
    const delta = this.isDay(ts) ? -0.6 : 0.6;
    const temp = this.targetTemperature(ts);

    return (
      vaporPressureDeficit(temp, delta, this.targetHumidity(ts) / 100) / 1000
    );
  }

  meanTemperature(): number {
    let result = 0;
    if (this.meters.length !== 0) {
      this.meters.forEach(meter => {
        result = result + meter.temperature;
      });
      result = result / this.meters.length;
    }
    return result;
  }

  meanHumidity(): number {
    let result = 0;
    if (this.meters.length !== 0) {
      this.meters.forEach(meter => {
        result = result + meter.humidity;
      });
      result = result / this.meters.length;
    }
    return result;
  }

  meanPressure(): number {
    const delta = this.isDay(new Date()) ? -0.6 : 0.6;
    const temp = this.meanTemperature();

    return vaporPressureDeficit(temp, delta, this.meanHumidity()) / 1000;
  }
}

export interface ZonesState {
  zones: Zone[];
  error: boolean;
}
