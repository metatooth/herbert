import http from "http";
import WebSocket from "ws";
import { HerbertSocket } from "./socket";

const port = process.env.WSS_PORT || 2929;
const httpServer = http.createServer();
httpServer.listen(port, () => {
  console.log(`socket server listening on port ${port}`);
  const wss = new WebSocket.Server({ server: httpServer });
  const herbertSocket = new HerbertSocket(wss);
  herbertSocket.listen();
});
