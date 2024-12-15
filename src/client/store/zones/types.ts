import { Device } from "@/store/devices/types";
import { Meter } from "@/store/meters/types";
import { Profile } from "@/store/profiles/types";
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

  get name(): string {
    return this.nickname;
  }

  meanTemperature(): number {
    let result = 0;
    if (this.meters.length !== 0) {
      this.meters.forEach((meter) => {
        result = result + parseFloat(meter.temperature);
      });
      result = result / this.meters.length;
    }
    return result;
  }

  meanHumidity(): number {
    let result = 0;
    if (this.meters.length !== 0) {
      this.meters.forEach((meter) => {
        result = result + parseFloat(meter.humidity);
      });
      result = result / this.meters.length;
    }
    return result;
  }

  get shortname(): string {
    const tokens = this.nickname.split(" ");

    let shortname = tokens[0].slice(0, 5);

    if (tokens.length === 2) {
      if (!isNaN(tokens[1])) {
        let index = tokens[1];
        if (index.length < 2) {
          index = `0${index}`;
        }
        shortname = `${tokens[0].slice(0, 5)}${index}`;
      } else {
        shortname = `${tokens[0].slice(0, 5)}${tokens[1].slice(0, 4)}`;
      }
    }

    return shortname;
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
}

export interface ZonesState {
  zones: Zone[];
  error: boolean;
}
