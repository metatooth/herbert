import WebSocket from "ws";
import config from "config";
import express from "express";
import cors from "cors";
import http from "http";
import mountRoutes from "./routes";
import {
  readZones,
  reading,
  registerDevice,
  createReading,
  createStatus,
  workerStatus
} from "./db";

import path from "path";
import favicon from "serve-favicon";

import { AirDirectives } from "../shared/air-directives";
import { BlowerTimer } from "../shared/blower-timer";
import { Clime } from "../shared/clime";
import { LampTimer } from "../shared/lamp-timer";
import { TargetTempHumidity } from "../shared/target-temp-humidity";
import { zonedTimeToUtc } from "date-fns-tz";

const app = express();
console.log("== Herbert Server == Starting Up ==");
console.log("Node.js, Express, WebSocket, and PostgreSQL application created.");

app.use(favicon(path.join(__dirname, "favicon.ico")));
console.log("favicon!");

app.use(express.json());
console.log("JSON support");

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

process.env.TZ = "ETC/Utc";

const server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);

const wss = new WebSocket.Server({ server: server });
console.log("websocket server created");

wss.on("connection", function(ws: WebSocket) {
  console.log("websocket connection open");

  ws.on("message", async function(msg: string) {
    console.log("ON MESSAGE", msg);

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
        registerDevice(data.payload.device, data.payload.manufacturer);
        createReading(
          data.payload.device,
          data.payload.temperature,
          data.payload.humidity,
          data.payload.pressure
        );
      } else if (data.payload.device) {
        console.log("Status message from switch", data.payload);
        registerDevice(data.payload.device, data.payload.manufacturer);
        console.log("Registered!");
        createStatus(data.payload.device, data.payload.status);
        console.log("Status saved!");
      }

      if (data.payload.worker) {
        console.log("Status message from worker", data.payload);
        workerStatus(data.payload.worker, data.payload.inet);
      }
    }

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
});

async function run() {
  const zones = await readZones();
  zones.forEach(async zone => {
    const now = new Date();
    const hour = now.getUTCHours();
    const min = now.getUTCMinutes();
    const sec = now.getUTCSeconds();

    if (zone.profile) {
      console.log("command for zone", zone.nickname);
      let temperature = 0;
      let humidity = 0;
      const count = 0;
      await Promise.all(
        zone.devices.map(async device => {
          if (device.devicetype === "meter") {
            const rdg = await reading(device.device);
            console.log("lastest reading", rdg);
            temperature = (count * temperature + rdg.temperature) / (count + 1);
            humidity = (count * humidity + 100 * rdg.humidity) / (count + 1);
          }
        })
      );

      console.log("profile", zone.profile);
      console.log("state", hour, temperature, humidity);

      const now = new Date();
      console.log("now", now);

      console.log(now.getMonth());

      console.log(now.getDate());

      const monthnbr = now.getMonth() + 1;

      const month = monthnbr < 10 ? `0${monthnbr}` : monthnbr.toString();
      const date =
        now.getDate() < 10 ? `0${now.getDate()}` : now.getDate().toString();

      console.log("month", month, "date", date);

      const startat = `${now.getFullYear()}-${month}-${date} ${
        zone.profile.lampstart
      }`;

      console.log("startat", startat);

      const utc = zonedTimeToUtc(startat, zone.profile.timezone);

      console.log("UTC", utc);

      const duration = zone.profile.lampduration["hours"];

      const lamp = new LampTimer(utc.getHours(), duration);

      const blower = new BlowerTimer(60, 180); // WARNING!!

      let target;
      let delta;

      console.log("check hour", hour);

      if (lamp.isOn(hour)) {
        console.log("lamps", lamp, "ON");
        target = new TargetTempHumidity([
          zone.profile.lampontemperature,
          zone.profile.lamponhumidity
        ]);
        delta = -0.6;
      } else {
        console.log("lamps", lamp, "OFF");
        target = new TargetTempHumidity([
          zone.profile.lampofftemperature,
          zone.profile.lampoffhumidity
        ]);
        delta = 0.6;
      }

      const directives = new AirDirectives(target);
      directives.clime = new Clime(temperature, delta, humidity);
      directives.monitor();

      console.log(directives);

      console.log("blower is on", min, sec, blower.isOn(min * 60 + sec));
      console.log("blower is cooling", directives.temperature === "cool");

      const systems = new Map([
        ["lamp", lamp.isOn(hour)],
        [
          "blower",
          blower.isOn(min * 60 + sec) || directives.temperature === "cool"
        ],
        ["heater", directives.temperature === "heat"],
        ["dehumidifer", directives.humidity === "dehumidify"],
        ["humidifier", directives.humidity === "humidify"],
        ["fan", 1 === 1]
      ]);

      console.log("SYSTEMS!", systems);

      systems.forEach((value, key) => {
        zone.devices.map(device => {
          if (device.devicetype === key) {
            const action = value ? "on" : "off";
            const data = {
              type: "COMMAND",
              payload: {
                device: device.device,
                action: action,
                timestamp: new Date()
              }
            };
            console.log("sending...", data);
            wss.clients.forEach(client => {
              client.send(JSON.stringify(data));
            });
          }
        });
      });
    }
  });

  setTimeout(run, config.get("interval") * 1000);
}

(async () => {
  run();
})();
