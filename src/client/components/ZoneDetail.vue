<template>
  <div id="linkto" class="level">
    <div class="card">
      <div class="card-content">
        <edit-text v-bind:text="zone.nickname" @edit-text="saveNickname" />
      </div>

      <div class="card-content">
        <div class="field is-grouped">
          <div class="control">
            <span class="tag is-medium">Actual</span>
          </div>
          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-medium" :class="meanTemperatureIconClass">
                <font-awesome-icon icon="thermometer-half" />
              </span>
              <span class="tag is-medium" :class="meanTemperatureDisplayClass">
                {{ meanTemperature.toFixed(1) }} {{ unitsWithDegree }}
              </span>
            </div>
          </div>

          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-medium" :class="meanHumidityIconClass">
                <font-awesome-icon icon="tint" />
              </span>
              <span class="tag is-medium" :class="meanHumidityDisplayClass">
                {{ meanHumidity.toFixed(0) }} %
              </span>
            </div>
          </div>

          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-medium" :class="meanPressureIconClass">
                <font-awesome-icon icon="cloud" />
              </span>
              <span class="tag is-medium" :class="meanPressureDisplayClass">
                {{ meanPressure.toFixed(1) }} hPa
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="field is-grouped">
          <div class="control">
            <span class="tag is-medium">Target</span>
          </div>

          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-medium" :class="targetIconClass">
                <font-awesome-icon icon="thermometer-half" />
              </span>
              <span class="tag is-medium" :class="targetDisplayClass">
                {{ targetTemperature.toFixed(1) }} {{ unitsWithDegree }}
              </span>
            </div>
          </div>

          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-medium" :class="targetIconClass">
                <font-awesome-icon icon="tint" />
              </span>
              <span class="tag is-medium" :class="targetDisplayClass">
                {{ targetHumidity.toFixed(0) }} %
              </span>
            </div>
          </div>

          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-medium" :class="targetIconClass">
                <font-awesome-icon icon="cloud" />
              </span>
              <span class="tag is-medium" :class="targetDisplayClass">
                {{ targetPressure.toFixed(1) }} hPa
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="card-content">
        <select-profile
          label="Growing"
          v-bind:zone="zone"
          @select-profile="saveProfile"
        />
      </div>

      <div class="card-content">
        <div class="field is-grouped is-grouped-multiline">
          <meter-widget
            v-for="meter in zoneMeters"
            :key="meter.device"
            :meter="meter"
            :units="units"
          />
        </div>
      </div>

      <div class="card-content">
        <div class="field is-grouped is-grouped-multiline">
          <device-widget
            v-for="device in zoneSwitches"
            :key="device.device"
            :device="device"
          />
        </div>
      </div>

      <div class="card-content">
        <select-device
          label="Meters"
          v-bind:devices="meters"
          @select-device="add"
        />
      </div>

      <div class="card-content">
        <select-device
          label="Switches"
          v-bind:devices="switches"
          @select-device="add"
        />
      </div>

      <footer class="card-footer">
        <div class="card-footer-item">
          <timestamp :timestamp="this.timestamp" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import EditText from "@/components/EditText.vue";
import HTTP from "@/api/http";
import SelectDevice from "@/components/SelectDevice.vue";
import SelectProfile from "@/components/SelectProfile.vue";
import Timestamp from "@/components/Timestamp.vue";
import Vue from "vue";
import { Device } from "@/store/devices/types";
import { LampTimer } from "../../shared/lamp-timer";
import { Zone } from "@/store/zones/types";
import MeterWidget from "@/components/MeterWidget.vue";
import DeviceWidget from "@/components/DeviceWidget.vue";
import {
  celsius2fahrenheit,
  fahrenheit2celsius,
  vaporPressureDeficit
} from "../../shared/utils";
import { mapState, mapGetters, mapActions } from "vuex";

interface Reading {
  temperature: number;
  humidity: number;
  pressure: number;
  createdat: Date;
}

interface Status {
  state: number;
  createdat: Date;
}

const ZoneDetail = Vue.extend({
  props: {
    zone: Zone,
    units: String
  },

  data() {
    return {
      readings: [] as Reading[],
      statuses: [] as Status[],
      timestamp: new Date()
    };
  },

  components: {
    DeviceWidget,
    EditText,
    MeterWidget,
    SelectDevice,
    SelectProfile,
    Timestamp
  },

  computed: {
    isDay(): boolean {
      let day = true;

      if (this.zone && this.zone.profile) {
        const start = this.zone.profile.lampstart.split(":");
        const duration = this.zone.profile.lampduration["hours"];

        const lamp = new LampTimer(parseInt(start[0]), duration);

        const hour = this.timestamp.getHours();
        day = lamp.isOn(hour);
      }

      return day;
    },

    linkto(): string {
      return `zone-details-${this.zone.id}`;
    },

    meanTemperature(): number {
      let sum = 0;
      this.readings.forEach(reading => {
        sum = sum + reading.temperature;
      });
      const mean = sum / this.readings.length;
      if (this.units === "F") {
        return celsius2fahrenheit(mean);
      }
      return mean;
    },

    meanHumidity(): number {
      let sum = 0;
      this.readings.forEach(reading => {
        sum = sum + 100 * reading.humidity;
      });
      return sum / this.readings.length;
    },

    meanPressure(): number {
      const delta = this.isDay ? -0.6 : 0.6;
      let temp = this.meanTemperature;
      if (this.units === "F") {
        temp = fahrenheit2celsius(temp);
      }

      return vaporPressureDeficit(temp, delta, this.meanHumidity / 100) / 1000;
    },

    meanTemperatureDisplayClass(): string {
      if (this.meanTemperature < this.targetTemperature) {
        return "has-text-white has-background-info";
      } else if (this.meanTemperature > this.targetTemperature) {
        return "has-text-white has-background-danger";
      } else {
        return "has-text-white has-background-success";
      }
    },

    meanTemperatureIconClass(): string {
      if (this.meanTemperature < this.targetTemperature) {
        return "has-text-info has-background-black";
      } else if (this.meanTemperature > this.targetTemperature) {
        return "has-text-danger has-background-black";
      } else {
        return "has-text-success has-background-black";
      }
    },

    meanHumidityDisplayClass(): string {
      if (this.meanHumidity < this.targetHumidity) {
        return "has-text-white has-background-info";
      } else if (this.meanHumidity > this.targetHumidity) {
        return "has-text-white has-background-danger";
      } else {
        return "has-text-white has-background-success";
      }
    },

    meanHumidityIconClass(): string {
      if (this.meanHumidity < this.targetHumidity) {
        return "has-text-info has-background-black";
      } else if (this.meanHumidity > this.targetHumidity) {
        return "has-text-danger has-background-black";
      } else {
        return "has-text-success has-background-black";
      }
    },

    meanPressureDisplayClass(): string {
      if (this.meanPressure < this.targetPressure) {
        return "has-text-white has-background-info";
      } else if (this.meanPressure > this.targetPressure) {
        return "has-text-white has-background-danger";
      } else {
        return "has-text-white has-background-success";
      }
    },

    meanPressureIconClass(): string {
      if (this.meanPressure < this.targetPressure) {
        return "has-text-info has-background-black";
      } else if (this.meanPressure > this.targetPressure) {
        return "has-text-danger has-background-black";
      } else {
        return "has-text-success has-background-black";
      }
    },

    targetDisplayClass(): string {
      if (this.isDay) {
        return "has-text-black has-background-warning";
      } else {
        return "has-text-white has-background-dark";
      }
    },

    targetIconClass(): string {
      if (this.isDay) {
        return "has-text-warning has-background-black";
      } else {
        return "has-text-dark has-background-black";
      }
    },

    targetTemperature(): number {
      let target = 15;
      if (this.zone && this.zone.profile) {
        if (this.isDay) {
          target = parseFloat(this.zone.profile.lampontemperature);
        } else {
          target = parseFloat(this.zone.profile.lampofftemperature);
        }
      }

      return this.units === "F" ? celsius2fahrenheit(target) : target;
    },

    targetHumidity(): number {
      let target = 20;
      if (this.zone && this.zone.profile) {
        if (this.isDay) {
          target = parseFloat(this.zone.profile.lamponhumidity);
        } else {
          target = parseFloat(this.zone.profile.lampoffhumidity);
        }
      }
      return target;
    },

    targetPressure(): number {
      const delta = this.isDay ? -0.6 : 0.6;
      let temp = this.targetTemperature;
      if (this.units === "F") {
        temp = fahrenheit2celsius(temp);
      }

      return (
        vaporPressureDeficit(temp, delta, this.targetHumidity / 100) / 1000
      );
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    },

    zoneMeters(): Device[] {
      if (this.zone) {
        const result = this.zone.devices;
        const filter = (event: Device) => {
          return event.devicetype === "meter";
        };
        return result.filter(filter);
      }
      return [];
    },

    zoneSwitches(): Device[] {
      if (this.zone) {
        const result = this.zone.devices;
        const filter = (event: Device) => {
          return event.devicetype !== "meter";
        };
        return result.filter(filter);
      }
      return [];
    },

    ...mapState("devices", ["devices"]),
    ...mapState("profiles", ["profiles"]),
    ...mapState("zones", ["zones"]),
    ...mapGetters("devices", ["meters", "switches"])
  },

  mounted() {
    this.refresh();
  },

  methods: {
    add(selected: string) {
      const payload = { zone: this.zone, device: selected };
      this.addDevice(payload);
      this.fetchData();
    },

    refresh() {
      if (this.zone) {
        this.timestamp = new Date();

        this.readings = [];
        this.statuses = [];

        this.zone.devices.forEach((device: Device) => {
          if (device) {
            if (device.devicetype === "meter") {
              HTTP.get(`/readings?meter=${device.device}&last=one`).then(
                res => {
                  this.readings.push(res.data);
                }
              );
            } else {
              HTTP.get(`/statuses?device=${device.device}&last=one`).then(
                res => {
                  this.statuses.push(res.data);
                }
              );
            }
          }
        });
      }
      setTimeout(this.refresh, 30000);
    },

    remove(selected: string) {
      const payload = { zone: this.zone, device: selected };
      this.removeDevice(payload);
      this.fetchData();
    },

    saveNickname(nickname: string) {
      const zone = {
        id: this.zone.id,
        nickname: nickname,
        profileid: this.profileid
      };

      this.edit(zone);
    },

    saveProfile(profileid: number) {
      const zone = {
        id: this.zone.id,
        nickname: this.nickname,
        profileid: profileid
      };

      this.edit(zone);
    },

    ...mapActions("zones", ["addDevice", "edit", "fetchData", "removeDevice"])
  }
});

export default ZoneDetail;
</script>
