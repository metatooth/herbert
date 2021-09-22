import Websocket from "ws";
import { AnySocketMessage } from "../shared/types";

let socketConnection: Websocket;

const getSocketURL = () => {
  return process.env.WSS_URL || "";
};

const getSocketClient = (): Promise<Websocket> => {
  return new Promise(resolve => {
    if (socketConnection) {
      resolve(socketConnection);
      return;
    }
    socketConnection = new Websocket(getSocketURL());
    socketConnection.on("open", () => {
      resolve(socketConnection);
    });
  });
};

export const sendSocketMessage = async (msg: AnySocketMessage) => {
  try {
    const ws = await getSocketClient();
    await new Promise(resolve => ws.send(JSON.stringify(msg), resolve));
  } catch (e) {
    console.error(e.message);
    throw e;
  }
};
