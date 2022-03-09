import express from "express";
import cors from "cors";
import http from "http";
import mountRoutes from "./routes";
import { parentZone, readAccount, readActiveZones, readZone } from "./db";

import path from "path";
import favicon from "serve-favicon";

import { AirDirectives } from "../shared/air-directives";
import { BlowerTimer } from "../shared/blower-timer";
import { IrrigationTimer } from "../shared/irrigation-timer";
import { Clime } from "../shared/clime";
import { LampTimer } from "../shared/lamp-timer";
import { TargetTempHumidity } from "../shared/target-temp-humidity";
import { HiLo } from "../shared/hi-lo";
import { ConstantVpd } from "../shared/constant-vpd";
import { vaporPressureDeficit } from "../shared/utils";
import { zonedTimeToUtc } from "date-fns-tz";
import {
  makeSendByDeviceIDMessage,
  makeCommandMessage
} from "../shared/message-creators";
import { sendSocketMessage } from "./util";

const app = express();
console.log("== Herbert Server == Starting Up ==");
console.log("Node.js, Express, WebSocket, and PostgreSQL application created.");

app.use(favicon(path.join(__dirname, "favicon.ico")));
console.log("favicon!");

app.use(express.json({ limit: "50mb" }));
console.log("JSON support");

app.use(cors());
console.log("cors added");

mountRoutes(app);
console.log("routes added");

const port = process.env.API_PORT || 5000;

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

async function run() {
  const account = await readAccount(1);
  const zones = await readActiveZones();

  zones.forEach(async zone => {
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

      const delta = lamp.isOn(hour)
        ? zone.lamponleafdiff
        : zone.lampoffleafdiff;

      let target;

      console.log("active zone", zone.id, zone.nickname);
      console.log("check hour", hour);
      console.log("control type", zone.profile.controltype);

      if (zone.profile.controltype === "HI_LO") {
        target = new HiLo([
          zone.profile.lampontemperature,
          zone.profile.lampofftemperature,
          zone.profile.lamponhumidity,
          zone.profile.lampoffhumidity
        ]);
      } else if (zone.profile.controltype === "VPD") {
        const vpd = vaporPressureDeficit(
          zone.profile.lampontemperature,
          delta,
          zone.profile.lamponhumidity
        );
        target = new ConstantVpd([vpd, 100]);
      } else {
        if (lamp.isOn(hour)) {
          target = new TargetTempHumidity([
            zone.profile.lampontemperature,
            zone.profile.lamponhumidity
          ]);
        } else {
          target = new TargetTempHumidity([
            zone.profile.lampofftemperature,
            zone.profile.lampoffhumidity
          ]);
        }
      }

      const directives = new AirDirectives(target);
      directives.clime = new Clime(temperature, delta, humidity);
      directives.monitor();

      console.log(directives);

      let isblower = blower.isOn(min * 60 + sec);

      console.log("blower is on?", min, sec, isblower);
      const parent = await parentZone(zone.id);
      if (!isblower && parent) {
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
            const cmd = makeCommandMessage({
              device: device.device,
              action: action,
              timestamp: new Date().toString()
            });
            console.info("cmd is", device.nickname || device.device, action);
            const payload = { device: device.device, msg: cmd };
            sendSocketMessage(makeSendByDeviceIDMessage(payload));
          }
        });
      });

      const num = zone.children.length > 0 ? zone.children.length : 1;

      const irrigator = new IrrigationTimer(
        parseInt(zone.profile.irrigationperday),
        parseInt(zone.profile.irrigationduration),
        num,
        parseInt(zone.maxirrigators),
        utc.getHours()
      );

      console.log("irr", irrigator);

      if (num > 1) {
        let counter = 0;
        zone.children.forEach(async child => {
          const zone = await readZone(child);
          zone.devices.forEach(device => {
            if (device.devicetype === "irrigator") {
              const action = irrigator.isOn(ms % 86400000, ++counter)
                    ? "on"
                    : "off";
              console.log("multi zone", counter, action);
              const cmd = makeCommandMessage({
                device: device.device,
                action: action,
                timestamp: new Date().toString()
              });
              const payload = { device: device.device, msg: cmd };
              sendSocketMessage(makeSendByDeviceIDMessage(payload));
            }
          });
        });
      } else {
        zone.devices.forEach(device => {
          if (device.devicetype === "irrigator") {
            const action = irrigator.isOn(ms % 86400000, 0)
                  ? "on"
                  : "off";
            console.log("single zone", action);
            const cmd = makeCommandMessage({
              device: device.device,
              action: action,
              timestamp: new Date().toString()
            });
            const payload = { device: device.device, msg: cmd };
            sendSocketMessage(makeSendByDeviceIDMessage(payload));
          }
        });
      }
  });

  setTimeout(run, account.interval);
}

(async () => {
  run();
})();
