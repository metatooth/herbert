<template>
  <div :id="anchor" class="column">
    <div class="card">
      <div class="card-content">
        <edit-text
          v-bind:text="state.zone.nickname"
          @edit-text="saveNickname"
        />
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
          v-bind:profileid="profileid"
          @select-profile="saveProfile"
        />
      </div>

      <div class="card-content" v-if="editing">
        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button class="button is-primary" v-on:click="save">
              <font-awesome-icon icon="check" />
            </button>
          </div>

          <div class="control">
            <button class="button is-danger" v-on:click="cancel">
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="tags">
          <div
            class="tag is-info is-medium"
            v-for="meter in zoneMeters"
            v-bind:key="meter.device"
          >
            {{ meter.nickname || meter.device }}
            <button class="delete" v-on:click="removeDevice(meter.device)" />
          </div>
        </div>
      </div>

      <div class="card-content">
        <select-device
          label="Meters"
          v-bind:devices="allMeters"
          @select-device="addDevice"
        />
      </div>

      <div class="card-content">
        <div class="tags">
          <div
            class="tag is-success is-medium"
            v-for="meter in zoneSwitches"
            v-bind:key="meter.device"
          >
            {{ meter.nickname || meter.device }}
            <button class="delete" v-on:click="removeDevice(meter.device)" />
          </div>
        </div>
      </div>

      <div class="card-content">
        <select-device
          label="Switches"
          v-bind:devices="allSwitches"
          @select-device="addDevice"
        />
      </div>

      <footer class="card-footer">
        <div class="card-footer-item">
          <timestamp :timestamp="new Date(Date.parse(state.zone.updatedat))" />
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
import { Device, DeviceState } from "@/store/devices/types";
import { LampTimer } from "../../shared/lamp-timer";
import { ZoneState } from "@/store/zones/types";
import {
  celsius2fahrenheit,
  fahrenheit2celsius,
  vaporPressureDeficit
} from "../../shared/utils";

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

const ZoneCard = Vue.extend({
  props: {
    state: ZoneState,
    units: String
  },

  data() {
    return {
      profileid: this.state.zone.profileid,
      nickname: this.state.zone.nickname,
      readings: [] as Reading[],
      statuses: [] as Status[],
      timestamp: new Date(),
      editing: false
    };
  },

  components: {
    EditText,
    SelectDevice,
    SelectProfile,
    Timestamp
  },

  computed: {
    anchor(): string {
      if (this.state.zone) {
        return this.state.zone.id + "config";
      }
      return "nullconfig";
    },

    allMeters(): [] {
      const result = this.$store.getters.devices.allDevices;
      const filter = (event: Device) => {
        return event.devicetype === "meter";
      };
      return result.filter(filter);
    },

    allSwitches(): [] {
      const result = this.$store.getters.devices.allDevices;
      const filter = (event: Device) => {
        return event.devicetype !== "meter";
      };
      return result.filter(filter);
    },

    isDay(): boolean {
      let day = true;

      if (this.state.zone && this.state.zone.profile) {
        const start = this.state.zone.profile.lampstart.split(":");
        const duration = this.state.zone.profile.lampduration["hours"];

        const lamp = new LampTimer(parseInt(start[0]), duration);

        const hour = this.timestamp.getHours();
        console.log("Is daytime?", hour, lamp, lamp.isOn(hour));
        day = lamp.isOn(hour);
      }

      return day;
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

      if (this.state.zone && this.state.zone.profile) {
        if (this.isDay) {
          target = this.state.zone.profile.lampontemperature;
        } else {
          target = this.state.zone.profile.lampofftemperature;
        }
      }

      return this.units === "F" ? celsius2fahrenheit(target) : target;
    },

    targetHumidity(): number {
      let target = 20;
      if (this.state.zone && this.state.zone.profile) {
        if (this.isDay) {
          target = this.state.zone.profile.lamponhumidity;
        } else {
          target = this.state.zone.profile.lampoffhumidity;
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
      if (this.state.zone) {
        const result = this.state.zone.devices;
        const filter = (event: Device) => {
          return event.devicetype === "meter";
        };
        return result.filter(filter);
      }
      return [];
    },

    zoneSwitches(): Device[] {
      if (this.state.zone) {
        const result = this.state.zone.devices;
        const filter = (event: Device) => {
          return event.devicetype !== "meter";
        };
        return result.filter(filter);
      }
      return [];
    }
  },

  mounted() {
    this.refresh();
  },

  methods: {
    addDevice(selected: Device) {
      if (this.state.zone) {
        const payload = { zoneid: this.state.zone.id, device: selected };
        this.$store.dispatch("addZoneDevice", payload);
        this.$store.dispatch("getZones");
      }
    },

    cancel() {
      if (this.state.zone) {
        this.profileid = this.state.zone.profileid;
        this.nickname = this.state.zone.nickname;
      }
      this.editing = false;
    },

    edit() {
      this.editing = true;
    },

    refresh() {
      console.log("refresh readings & statuses");
      if (this.state.zone) {
        this.timestamp = new Date();

        this.readings = [];
        this.statuses = [];

        this.state.zone.devices.forEach((device: Device) => {
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

    removeDevice(selected: DeviceState) {
      if (this.state.zone) {
        const payload = { zoneid: this.state.zone.id, device: selected.device };
        this.$store.dispatch("removeZoneDevice", payload);
        this.$store.dispatch("getZones");
      }
    },

    save() {
      if (this.state.zone) {
        const zone = {
          id: this.state.zone.id,
          nickname: this.nickname,
          profileid: this.profileid
        };

        this.$store.dispatch("editZone", zone);
      }
      this.editing = false;
    },

    saveNickname(nickname: string) {
      if (this.state.zone) {
        const zone = {
          id: this.state.zone.id,
          nickname: nickname,
          profileid: this.profileid
        };

        this.$store.dispatch("editZone", zone);
      }
    },

    saveProfile(profileid: number) {
      if (this.state.zone) {
        const zone = {
          id: this.state.zone.id,
          nickname: this.nickname,
          profileid: profileid
        };

        this.$store.dispatch("editZone", zone);
      }
    }
  }
});

export default ZoneCard;
</script>
