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

export interface DevicesState {
  devices: Device[];
  error: boolean;
}
