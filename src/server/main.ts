import config from "config";
import express from "express";
import cors from "cors";
import http from "http";
import mountRoutes from "./routes";
import { parentZone, readActiveZones, readZone } from "./db";

import path from "path";
import favicon from "serve-favicon";

import { AirDirectives } from "../shared/air-directives";
import { BlowerTimer } from "../shared/blower-timer";
import { IrrigationTimer } from "../shared/irrigation-timer";
import { Clime } from "../shared/clime";
import { LampTimer } from "../shared/lamp-timer";
import { TargetTempHumidity } from "../shared/target-temp-humidity";
import { zonedTimeToUtc } from "date-fns-tz";
import { herbertSocket } from "./herbert-socket";
import { makeCommandMessage } from "../shared/message-creators";

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

process.env.TZ = "ETC/Utc";

const server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);
herbertSocket.init(server);

async function run() {
  const zones = await readActiveZones();

  zones.forEach(async zone => {
    console.log("active zone", zone.id, zone.nickname);
    const now = new Date();
    const hour = now.getUTCHours();
    const min = now.getUTCMinutes();
    const sec = now.getUTCSeconds();

    if (zone.profile) {
      let temperature = 0;
      let humidity = 0;
      let count = 0;
      await Promise.all(
        zone.meters.map(meter => {
          temperature =
            (count * temperature + 1 * meter.temperature) / (count + 1);
          humidity = (count * humidity + 100 * meter.humidity) / (count + 1);
          count++;
        })
      );

      const now = new Date();
      const ms = now.getTime();
      const monthnbr = now.getMonth() + 1;
      const month = monthnbr < 10 ? `0${monthnbr}` : monthnbr.toString();
      const date =
        now.getDate() < 10 ? `0${now.getDate()}` : now.getDate().toString();

      const startat = `${now.getFullYear()}-${month}-${date} ${
        zone.profile.lampstart
      }`;

      const utc = zonedTimeToUtc(startat, zone.profile.timezone);

      const duration = zone.profile.lampduration["hours"];

      const lamp = new LampTimer(utc.getHours(), duration);

      const blower = new BlowerTimer(
        zone.profile.bloweractive / 1000,
        zone.profile.blowercycle / 1000
      );

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

      let isblower = blower.isOn(min * 60 + sec);

      console.log("blower is on?", min, sec, isblower);
      if (!isblower) {
        const parent = await parentZone(zone.id);

        let mean = 0;
        if (parent.meters.length !== 0) {
          parent.meters.forEach(meter => {
            mean = mean + meter.temperature;
          });
          mean = mean / parent.meters.length;
        }

        console.log("parent and child", mean, temperature);

        if (mean < temperature && directives.temperature === "cool") {
          isblower = true;
          console.log("blower is cooling");
        } else if (mean > temperature && directives.temperature === "heat") {
          isblower = true;
          console.log("blower is heating");
        }
      }

      const systems = new Map([
        ["lamp", lamp.isOn(hour)],
        ["blower", isblower],
        ["heater", directives.temperature === "heat"],
        ["cooler", directives.temperature === "cool"],
        ["dehumidifier", directives.humidity === "dehumidify"],
        ["humidifier", directives.humidity === "humidify"],
        ["fan", 1 === 1]
      ]);

      systems.forEach((value, key) => {
        zone.devices.map(device => {
          if (device.devicetype === key) {
            const action = value ? "on" : "off";
            const msg = makeCommandMessage({
              device: device.device,
              action: action,
              timestamp: new Date().toString()
            });
            herbertSocket.broadcastAll(msg);
          }
        });
      });

      const irrigator = new IrrigationTimer(
        parseInt(zone.profile.irrigationperday),
        parseInt(zone.profile.irrigationduration),
        zone.children.length,
        parseInt(zone.maxirrigators),
        utc.getHours()
      );

      console.log("irr", irrigator);

      let counter = 0;
      zone.children.forEach(async child => {
        const zone = await readZone(child);
        zone.devices.forEach(device => {
          if (device.devicetype === "irrigator") {
            const action = irrigator.isOn(ms % 86400000, ++counter)
              ? "on"
              : "off";
            const msg = makeCommandMessage({
              device: device.device,
              action: action,
              timestamp: new Date().toString()
            });
            herbertSocket.broadcastAll(msg);
          }
        });
      });
    }
  });
}

(async () => {
  setInterval(run, (config.get("interval") as number) * 1000);
})();
