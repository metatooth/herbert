import WebSocket from "ws";
import express from "express";
import cors from "cors";
import http from "http";
import mountRoutes from "./routes";
import { registerDevice, registerWorker, createReading } from "./db";
import path from "path";
import favicon from "serve-favicon";

const app = express();
console.log("== Herbert Server == Starting Up ==");
console.log("Node.js, Express, WebSocket, and PostgreSQL application created.");

app.use(favicon(path.join(__dirname, "favicon.ico")));
console.log("favicon!");

app.use(cors());
console.log("cors added");

mountRoutes(app);
console.log("routes added");

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("OK");
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
  next();
});

function sendError(ws: WebSocket, message: string) {
  const messageObject = {
    type: "ERROR",
    payload: message
  };

  ws.send(JSON.stringify(messageObject));
}

const server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);

const wss = new WebSocket.Server({ server: server });
console.log("websocket server created");

wss.on("connection", function(ws: WebSocket) {
  console.log("websocket connection open");

  ws.on("message", async function(msg: string) {
    console.log(msg);

    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      sendError(ws, e);
      return;
    }

    if (!data.type || !data.payload) {
      sendError(ws, "Message must specify type & payload.");
      return;
    }

    if (data.type === "STATUS") {
      if (data.payload.device && data.payload.type === "meter") {
        console.log("Status message from meter", data.payload);
        registerDevice(data.payload.device,
                       data.payload.manufacturer,
                       data.payload.type);
        createReading(data.payload.device,
                      data.payload.temperature,
                      data.payload.humidity,
                      data.payload.pressure);
      }

      if (data.payload.worker) {
        console.log("Status message from worker", data.payload);
        registerWorker(data.payload.worker, data.payload.nickname);
      }
    }

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
});
