export interface Device {
  device: string;
  devicetype: string;
  manufacturer: string;
  nickname: string;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  status?: string;
  timestamp?: Date;
}

export class DeviceState {
  device: Device = {
    device: "",
    devicetype: "",
    manufacturer: "",
    nickname: "",
    createdat: new Date(),
    updatedat: new Date(),
    deleted: false
  };
  error = false;
}

export interface DevicesState {
  devices: DeviceState[];
  error: boolean;
}
