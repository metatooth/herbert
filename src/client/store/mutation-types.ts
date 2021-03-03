interface Manufacturer {
  manufacturer: string;
  username: string;
  passwordDigest: string;
  timestamp: Date;
}

export interface Device {
  device: string;
  deviceType: string;
  manufacturer: string;
  nickname: string;
  timestamp: Date;
}

export interface Profile {
  id: number;
  profile: string;
  lampOnHour: number;
  lampOnMinute: number;
  lampDuration: number;
  lampOnTemperature: number;
  lampOnHumidity: number;
  lampOffTemperature: number;
  lampOffHumidity: number;
  updatedAt: Date;
  timestamp: Date;
}

interface Reading {
  id: number;
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
  id: number;
  nickname: string;
  parent: string;
  profile: string;
  devices: number;
  updatedAt: Date;
  timestamp: Date;
}

export const ADD_ZONE = "ADD_ZONE";
export const EDIT_ZONE = "EDIT_ZONE";
export const REMOVE_ZONE = "REMOVE_ZONE";
export const SET_ZONES = "SET_ZONES";
export const ADD_PROFILE = "ADD_PROFILE";
export const EDIT_PROFILE = "EDIT_PROFILE";
export const REMOVE_PROFILE = "REMOVE_PROFILE";
export const SET_PROFILES = "SET_PROFILES";
export const EDIT_DEVICE = "EDIT_DEVICE";
export const SET_DEVICES = "SET_DEVICES";
export const SET_WORKERS = "SET_WORKERS";
