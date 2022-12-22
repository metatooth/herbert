import axios from "axios";

import { Account, Zone } from "../shared/types";
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

process.env.TZ = "ETC/Utc";

const apiUrl = process.env.API_URL || "";
const HTTP = axios.create({ baseURL: apiUrl });

let account;
let zones;

async function run() {
  console.log("RUN");
  
  const R1 = await HTTP.get<Account>("/settings");
  account = R1.data;
  
  const R2 = await HTTP.get<[Zone]>("/zones");
  zones = R2.data.filter((z) => { if (z.active) return z.profile });

  zones.forEach(async zone => {
    const now = new Date();

    let temperature = 0;
    let humidity = 0;
    let count = 0;
    await Promise.all(
      zone.meters.map(meter => {
        temperature =
          (count * temperature + 1 * meter.temperature) / (count + 1);
        humidity = (count * humidity + meter.humidity) / (count + 1);
        count++;
      })
    );
    
    const ms = now.getTime();
    const monthnbr = now.getMonth() + 1;
    const month = monthnbr < 10 ? `0${monthnbr}` : monthnbr.toString();
    const date =
          now.getDate() < 10 ? `0${now.getDate()}` : now.getDate().toString();
    
    const startat = `${now.getFullYear()}-${month}-${date} ${
        zone.profile.lampStart
      }`;
    
    const utc = zonedTimeToUtc(startat, zone.profile.timezone);
    
    const duration = zone.profile.lampDuration;

    const lamp = new LampTimer(utc.getHours(), duration);
    
    const blower = new BlowerTimer(
      zone.profile.bloweractive / 1000,
      zone.profile.blowercycle / 1000
    );

    const hour = now.getUTCHours();

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
        zone.profile.lampontemperature / 1,
        delta / 1,
        zone.profile.lamponhumidity / 1000
      );
      target = new ConstantVpd(vpd);
    } else {
      console.log("it is targets?", zone.profile.controltype);
      console.log(zone.profile);

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

    console.log("target", target);

    console.log("temperature", temperature);
    console.log("delta", delta);
    console.log("humidity", humidity);
    
    const directives = new AirDirectives(target);
    directives.clime = new Clime(temperature, delta / 1, humidity);
    directives.monitor();
    
    console.log(directives);
    
    const min = now.getUTCMinutes();
    const sec = now.getUTCSeconds();

    let isblower = blower.isOn(min * 60 + sec);
    
    console.log("blower is on?", min, sec, isblower);
    
    const R4 = await HTTP.get<Zone>(`/zones/${zone.id}/parent`);
    const parent = R4.data;
    
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
      zone.profile.irrigationperday,
      zone.profile.irrigationduration,
      num,
      zone.maxirrigators,
      utc.getHours()
    );
    
    console.log("irr", irrigator);
    
    if (num > 1) {
      let counter = 0;
      zone.children.forEach(async child => {
        const R3 = await HTTP.get<Zone>(`/zones/${child.id}/`);
        const zone = R3.data;
        
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
          const action = irrigator.isOn(ms % 86400000, 0) ? "on" : "off";
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
