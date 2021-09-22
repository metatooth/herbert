import {
  AnySocketMessage,
  CommandPayload,
  ConfigurePayload,
  ErrorPayload,
  MeterStatusPayload,
  RegisterWorkerPayload,
  SendByDeviceIDPayload,
  SocketMessageType,
  SwitchStatusPaylaod,
  WorkerStatusPayload
} from "./types";
import { createMessageCreator } from "./type-guards";

export const makeWorkerRegisterMessage = createMessageCreator(
  SocketMessageType.Register
)<RegisterWorkerPayload>();

export const makeCommandMessage = createMessageCreator(
  SocketMessageType.Command
)<CommandPayload>();

export const makeErrorMessage = createMessageCreator(SocketMessageType.Error)<
  ErrorPayload
>();

export const makeConfigureMessage = createMessageCreator(
  SocketMessageType.Configure
)<ConfigurePayload>();

export const makeWorkerStatusMessage = createMessageCreator(
  SocketMessageType.WorkerStatus
)<WorkerStatusPayload>();

export const makeSwitchStatusMessage = createMessageCreator(
  SocketMessageType.SwitchStatus
)<SwitchStatusPaylaod>();

export const makeMeterStatusMessage = createMessageCreator(
  SocketMessageType.MeterStatus
)<MeterStatusPayload>();

export const makeSendWorkerConfigMessage = createMessageCreator(
  SocketMessageType.SendWorkerConfig
)<string>();

export const makeBroadcastAllMessage = createMessageCreator(
  SocketMessageType.BroadcastAll
)<AnySocketMessage>();

export const makeSendByDeviceIDMessage = createMessageCreator(
  SocketMessageType.SendByDeviceID
)<SendByDeviceIDPayload>();
