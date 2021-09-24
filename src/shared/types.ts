export interface Config {
  nickname: string;
  config: string;
}

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
  configname: string;
  timestamp: Date;
}

export interface Zone {
  id: number;
  nickname: string;
  maxirrigators: number;
  profile: Profile;
  children: Zone[];
  meters: Meter[];
  devices: Device[];
  timestamp: Date;
}

// Represents the various socket message types
export enum SocketMessageType {
  WorkerStatus = "WORKER_STATUS",
  MeterStatus = "METER_STATUS",
  SwitchStatus = "SWITCH_STATUS",
  Register = "REGISTER",
  Command = "COMMAND",
  Configure = "CONFIGURE",
  Error = "ERROR",
  SendWorkerConfig = "SEND_WORKER_CONFIG",
  BroadcastAll = "BROADCAST_ALL",
  SendByDeviceID = "SEND_BY_DEVICE_ID"
}

// Represents a simple message consisting only of a type
export interface BasicSocketMessage<T extends SocketMessageType> {
  type: T;
}

// Represents a socket message with a payload
export interface SocketMessage<T extends SocketMessageType, P>
  extends BasicSocketMessage<T> {
  payload: P;
}

// Represents any socket message
export type AnySocketMessage = SocketMessage<SocketMessageType, unknown>;

// Represents a function that creates a socket message object
export type MessageCreator<T extends SocketMessageType, P> = (
  payload: P
) => SocketMessage<T, P>;

// Represents an enhancement on the creator function that allows it to
// type guard messages that match the creator's type
export interface EnhancedMessageCreator<T extends SocketMessageType, P>
  extends MessageCreator<T, P> {
  type: T;
  isOfType(msg: SocketMessage<T, unknown>): msg is SocketMessage<T, P>;
}

// Represents the payload for a register message from a worker
export interface RegisterWorkerPayload {
  worker: string;
  inet: string;
}

// Represents the payload for COMMAND messages
export interface CommandPayload {
  device: string;
  action: string;
  timestamp: string;
}

export interface ErrorPayload {
  message: string;
  timestamp: string;
  id?: string;
  worker?: string;
  device?: string;
  action?: string;
  code?: number;
}

export interface ConfigurePayload {
  worker: string;
  config: string;
  timestamp: string;
}

export interface WorkerStatusPayload {
  worker: string;
  inet: string;
  config: string;
  timestamp: string;
}

export interface SwitchStatusPaylaod {
  device: string;
  manufacturer: string;
  status: string;
  timestamp: string;
}

export interface MeterStatusPayload {
  device: string;
  type: string;
  manufacturer: string;
  temperature: number;
  humidity: number;
  pressure: number;
  timestamp: string;
}

export interface SendByDeviceIDPayload {
  device: string;
  msg: AnySocketMessage;
}
