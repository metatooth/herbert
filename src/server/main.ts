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
import { sendSocketMessage } from "../shared/send-socket-message";

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
