interface Manufacturer {
  manufacturer: string;
  username: string;
  passwordDigest: string;
  timestamp: Date
}

interface Device {
  device: string;
  deviceType: string;
  manufacturer: string;
  nickname: string;
  timestamp: Date
}

interface Notification {
  id: string;
  plug: string;
  action: string;
  code: string;
  message: string;
  timestamp: Date;
}

interface Profile {
  id: numeric;
  profile: string;
  lampStart: number;
  lampDuration: number;
  lampOnTemperature: number; 
  lampOnHumidity: number;
  lampOffTemperature: number;
  lampOffHumidity: number;
  timestamp: Date
}

interface Reading {
  id: numeric;
  meter: string;
  temperature: numeric;
  humidity: numeric;
  pressure: numeric;
  timestamp: Date;
}

interface Worker {
  worker: string;
  nickname: string;
  timestamp: Date;
}

interface Zone {
  id: numeric;
  nickname: string;
  parent: numeric;
  profile: numeric;
  devices: [] as DeviceData[];
  timestamp: Date;
}

export = { Manufacturer, Device, Notification, Profile, Reading, Worker, Zone };
