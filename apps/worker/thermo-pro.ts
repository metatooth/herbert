import * as noble from "@abandonware/noble";

import { AnySocketMessage, SocketMessageType } from "../shared/types";
import { makeBroadcastAllMessage } from "../shared/message-creators";
import { Device } from "./device";

export class ThermoPro extends Device {
  socket;

  constructor() {
    super("", "thermopro");

    this.socket = noble;

    console.log("thermopro constructor");

    this.socket.on("stateChange", (state) => {
      console.log("state change", state);
    });

    this.socket.on("discover", (peripheral) => {
      console.log("discover!", peripheral);
    });
  }

  status(): AnySocketMessage {
    return makeBroadcastAllMessage({
      type: SocketMessageType.BroadcastAll,
      payload: {},
    });
  }

  async scan() {
    console.log("scan");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("stop scan");
  }
}
