import WebSocket from "ws";
import express from "express";
import http from "http";
import { createMeterReading, meterReadings } from "../shared/db";

const app = express();
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

app.param("meter", (req, res, next, id) => {
  console.log("meter reading for", id);
  meterReadings(id).then(readings => {
    if (readings.length > 0) {
      res.status(200).json(readings);
      next();
    } else {
      next(new Error("failed to find meter"));
    }
  });
});

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/readings/:meter", (req, res, next) => {
  next();
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

const server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);

const wss = new WebSocket.Server({ server: server });
console.log("websocket server created");

let sockets: WebSocket[] = [];
wss.on("connection", function(socket: WebSocket) {
  console.log("websocket connection open");
  sockets.push(socket);

  // When you receive a message, send that message to every socket.
  socket.on("message", function(msg: string) {
    console.log(msg);
    const data = JSON.parse(msg);
    console.log(data.id, data.temperature, data.humidity);
    if (data.main_meter) {
      createMeterReading(data.main_meter, data.temperature, data.humidity);
    }

    if (data.intake_meter) {
      createMeterReading(
        data.intake_meter,
        data.intake_temperature,
        data.intake_humidity
      );
    }

    sockets.forEach(s => s.send(msg));
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on("close", function() {
    sockets = sockets.filter(s => s !== socket);
  });
});
