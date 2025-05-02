import { io, Socket } from "socket.io-client";
import { AnySocketMessage, SocketMessageMap } from "../shared/types";

let socket: Socket<SocketMessageMap>;

const getSocketURL = () => {
  return process.env.WSS_URL || "";
};

const getSocketClient = () => {
  if (!socket) {
    socket = io(getSocketURL());
  }
  return socket;
};

export const sendSocketMessage = (msg: AnySocketMessage) => {
  try {
    const ws = getSocketClient();
    ws.emit("message", msg);
  } catch (e) {
    console.error(e.message);
    throw e;
  }
};
