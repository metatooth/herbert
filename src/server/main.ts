import WebSocket from "ws";
import * as config from "./config";

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(`*******************************************`);

const wss = new WebSocket.Server({ port: Number(config.SERVER_PORT) });

let sockets: WebSocket[] = [];
wss.on("connection", function (socket: WebSocket) {
  console.log("websocket connection open");
  sockets.push(socket);

  socket.on("message", function (msg: string) {
    console.log(msg);
    sockets.forEach((s) => s.send(msg));
  });

  socket.on("close", function () {
    sockets = sockets.filter((s) => s !== socket);
  });
});
