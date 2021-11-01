import { LampTimer } from "../../../shared/lamp-timer";

export class Profile {
  id: number;
  profile: string;
  lampstart: string;
  lampduration: { hours: number };
  lampontemperature: number;
  lamponhumidity: number;
  lampofftemperature: number;
  lampoffhumidity: number;
  bloweractive: number;
  blowercycle: number;
  irrigationperday: number;
  irrigationduration: number;
  maxirrigators: number;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;

  get name() {
    return this.profile;
  }

  isDay(timestamp: Date) {
    const start = this.lampstart.split(":");
    const duration = this.lampduration["hours"];

    const lamp = new LampTimer(parseInt(start[0]), duration);

    const hour = timestamp.getHours();

    return lamp.isOn(hour);
  }

  targetTemperature(ts: Date) {
    return this.isDay(ts) ? this.lampontemperature : this.lampofftemperature;
  }

  targetHumidity(ts: Date) {
    return this.isDay(ts) ? this.lamponhumidity : this.lampoffhumidity;
  }
}

export interface ProfilesState {
  profiles: Profile[];
  error: boolean;
}
