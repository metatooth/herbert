import {
  CommandPayload,
  ConfigurePayload,
  ErrorPayload,
  MeterStatusPayload,
  RegisterWorkerPayload,
  SocketMessageType,
  SwitchStatusPaylaod,
  WorkerStatusPayload
} from "./types";
import { createMessageCreator } from "./util";

export const makeWorkerRegisterMessage = createMessageCreator<
  SocketMessageType.Register,
  RegisterWorkerPayload
>(SocketMessageType.Register);

export const makeCommandMessage = createMessageCreator<
  SocketMessageType.Command,
  CommandPayload
>(SocketMessageType.Command);

export const makeErrorMessage = createMessageCreator<
  SocketMessageType.Error,
  ErrorPayload
>(SocketMessageType.Error);

export const makeConfigureMessage = createMessageCreator<
  SocketMessageType.Configure,
  ConfigurePayload
>(SocketMessageType.Configure);

export const makeWorkerStatusMessage = createMessageCreator<
  SocketMessageType.WorkerStatus,
  WorkerStatusPayload
>(SocketMessageType.WorkerStatus);

export const makeSwitchStatusMessage = createMessageCreator<
  SocketMessageType.SwitchStatus,
  SwitchStatusPaylaod
>(SocketMessageType.SwitchStatus);

export const makeMeterStatusMessage = createMessageCreator<
  SocketMessageType.MeterStatus,
  MeterStatusPayload
>(SocketMessageType.MeterStatus);
