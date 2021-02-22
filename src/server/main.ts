import WebSocket from "ws";
import express from "express";
import http from "http";
import mountRoutes from "./routes";
import { register, status } from "./db";

const app = express();
console.log("== Herbert Worker == Starting Up ==");
console.log("Node.js, Express, WebSocket, and PostgreSQL application created.");

mountRoutes(app);
console.log("routes added");

const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("OK");
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
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

  ws.on("message", function(msg: string) {
    console.log("msg", msg);
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
        register(data.payload.id,
                 data.payload.main_meter,
                 data.payload.intake_meter,
                 "");
        status(data.payload.main_meter,
               data.payload.temperature,
               data.payload.humidity);      
        status(data.payload.intake_meter,
               data.payload.intake_temperature,
               data.payload.intake_humidity);      
    }
      
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
});
