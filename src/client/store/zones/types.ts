import { Device } from "@/store/devices/types";
import { Profile } from "@/store/profiles/types";

export interface Zone {
  id: number;
  nickname: string;
  profileid?: number;
  profile?: Profile;
  devices: Device[];
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
}

export class ZoneState {
  zone: Zone = {
    id: 0,
    nickname: "",
    devices: [],
    createdat: new Date(),
    updatedat: new Date(),
    deleted: false
  };
  error = false;
}

export interface ZonesState {
  zones: Zone[];
  error: boolean;
}
