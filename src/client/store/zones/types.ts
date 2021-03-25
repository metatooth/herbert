import { Device } from "@/store/devices/types";
import { Profile } from "@/store/profiles/types";

export class Zone {
  id: number;
  nickname: string;
  profileid?: number;
  profile?: Profile;
  devices: Device[];
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;

  constructor() {
    this.id = 0;
    this.nickname = "";
    this.devices = [];
    this.createdat = new Date();
    this.updatedat = new Date();
    this.deleted = false;
  }
}

export interface ZonesState {
  zones: Zone[];
  error: boolean;
}
