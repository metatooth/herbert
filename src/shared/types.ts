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
  config: string;
  timestamp: Date;
}

export interface Zone {
  id: number;
  nickname: string;
  maxirrigators: number;
  profile: Profile;
  children: Zone[];
  timestamp: Date;
}

export enum HerbertMessageType {
  Status    = 'STATUS',
  Register  = 'REGISTER',
  Command   = 'COMMAND',
  Configure = 'CONFIGURE',
  Error     = 'ERROR',
}

export interface HerbertSocketMessage {
  type: HerbertMessageType;
  payload: any;
}

export function isHerbertMessageType(t: any): t is HerbertMessageType {
  return Object.values(HerbertMessageType).includes(t);
}

export function isHerbertSocketMessage(m: any): m is HerbertSocketMessage {
  return (
    typeof m === 'object' &&
    'type' in m &&
    isHerbertMessageType(m.type) &&
    'payload' in m &&
    typeof m.payload === 'object'
  );
}
