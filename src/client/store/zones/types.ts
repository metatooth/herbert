import { Device } from "@/store/devices/types";
import { Meter } from "@/store/meters/types";
import { Profile } from "@/store/profiles/types";
import { vaporPressureDeficit } from "../../../shared/utils";
import { LampTimer } from "../../../shared/lamp-timer";

export class Zone {
  id: number;
  nickname: string;
  maxirrigators: number;
  profileid?: number;
  profile?: Profile;
  devices: Device[];
  meters: Meter[];
  children: number[];
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
  active: boolean;

  get name() {
    return this.nickname;
  }

  isDay(timestamp: Date) {
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

  targetTemperature(ts: Date) {
    if (this.profile) {
      return this.isDay(ts)
        ? this.profile.lampontemperature
        : this.profile.lampofftemperature;
    }
    return 20;
  }

  targetHumidity(ts: Date) {
    if (this.profile) {
      return this.isDay(ts)
        ? this.profile.lamponhumidity
        : this.profile.lampoffhumidity;
    }
    return 35;
  }

  meanTemperature(): number {
    let result = 0;
    if (this.meters.length !== 0) {
      this.meters.forEach(meter => {
        result = result + parseFloat(meter.temperature);
      });
      result = result / this.meters.length;
    }
    return result;
  }

  meanHumidity(): number {
    let result = 0;
    if (this.meters.length !== 0) {
      this.meters.forEach(meter => {
        result = result + parseFloat(meter.humidity);
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
