import WebSocket from "ws";
import express from "express";
import cors from "cors";
import http from "http";
import mountRoutes from "./routes";
import { query, register, status } from "./db";
import path from "path";
import favicon from "serve-favicon";

const app = express();
console.log("== Herbert Worker == Starting Up ==");
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
      register(
        data.payload.client,
        data.payload.main.meter,
        data.payload.intake.meter,
        ""
      );
      status(
        data.payload.main.meter,
        "main",
        data.payload.main.temperature,
        data.payload.main.humidity,
        data.payload.main.pressure
      );
      status(
        data.payload.intake.meter,
        "intake",
        data.payload.intake.temperature,
        data.payload.intake.humidity,
        data.payload.intake.pressure
      );

      const {
        rows
      } = await query(
        "SELECT * FROM clients c LEFT JOIN profiles p ON c.profile_id = p.id WHERE client = $1",
        [data.payload.client]
      );
      console.log("FOUND CLIENT", rows[0]);

      if (rows[0].profile_id) {
        const reply = {
          type: "CONFIG",
          payload: {
            id: rows[0].client,
            lampStart: rows[0].lamp_start,
            lampDuration: rows[0].lamp_duration,
            lampOnTemperature: rows[0].lamp_on_temperature,
            lampOnHumidity: rows[0].lamp_on_humidity,
            lampOffTemperature: rows[0].lamp_off_temperature,
            lampOffHumidity: rows[0].lamp_off_humidity,
            timestamp: new Date()
          }
        };

        ws.send(JSON.stringify(reply));
      }
    }

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
});
