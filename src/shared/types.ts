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
  status: string;
}

export interface Meter {
  device: string;
  devicetype: string;
  manufacturer: string;
  nickname: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure: number;
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
  timezone: string;
  lampStart: number;
  lampDuration: number;
  lampOnTemperature: number;
  lampOnHumidity: number;
  lampOffTemperature: number;
  lampOffHumidity: number;
  bloweractive: number;
  blowercycle: number;
  irrigationperday: number;
  irrigationduration: number;
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
  maxirrigators: number;
  parent: string;
  profile: string;
  timestamp: Date;
}
