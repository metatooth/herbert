export interface Manufacturer {
  manufacturer: string;
  username: string;
  passwordDigest: string;
  timestamp: Date;
}

export interface Device {
  device: string;
  devicetype: string;
  manufacturer: string;
  nickname: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  plug: string;
  action: string;
  code: string;
  message: string;
  timestamp: Date;
}

export interface Profile {
  id: string;
  profile: string;
  lampStart: number;
  lampDuration: number;
  lampOnTemperature: number;
  lampOnHumidity: number;
  lampOffTemperature: number;
  lampOffHumidity: number;
  timestamp: Date;
}

export interface Reading {
  id: string;
  meter: string;
  temperature: number;
  humidity: number;
  pressure: number;
  timestamp: Date;
}

export interface Worker {
  worker: string;
  nickname: string;
  timestamp: Date;
}

export interface Zone {
  id: string;
  nickname: string;
  parent: string;
  profile: string;
  timestamp: Date;
}
