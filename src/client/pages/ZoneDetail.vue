<template>
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
        v-bind:profileid="zone.profileid"
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
        <timestamp :timestamp="new Date(Date.parse(zone.updatedat))" />
      </div>
    </footer>
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
import { Zone } from "@/store/zones/types";
import {
  celsius2fahrenheit,
  fahrenheit2celsius,
  vaporPressureDeficit
} from "../../shared/utils";
import { mapState, mapGetters } from "vuex";

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
  data() {
    return {
      zone: {
        id: 0,
        nickname: "",
        devices: [],
        profileid: 0,
        updatedat: new Date()
      } as Zone,
      units: "F",
      readings: [] as Reading[],
      statuses: [] as Status[],
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
    isDay(): boolean {
      let day = true;

      if (this.zone && this.zone.profile) {
        const start = this.zone.profile.lampstart.split(":");
        const duration = this.zone.profile.lampduration["hours"];

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

      if (this.zone && this.zone.profile) {
        if (this.isDay) {
          target = this.zone.profile.lampontemperature;
        } else {
          target = this.zone.profile.lampofftemperature;
        }
      }

      console.log("target temp", target, this.units);

      return this.units === "F" ? celsius2fahrenheit(target) : target;
    },

    targetHumidity(): number {
      let target = 20;
      if (this.zone && this.zone.profile) {
        if (this.isDay) {
          target = this.zone.profile.lamponhumidity;
        } else {
          target = this.zone.profile.lampoffhumidity;
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
    ...mapGetters("devices", ["allMeters", "allSwitches"])
  },

  mounted() {
    const zone = this.zones.find((el: Zone) => {
      return this.$route.params.id === el.id;
    });
    console.log("data", zone);

    this.zone.id = zone.id;
    this.zone.nickname = zone.nickname;
    this.zone.profileid = zone.profileid;
    this.zone.devices = zone.devices;
    this.zone.updatedat = zone.updatedat;

    this.units = this.$route.params.units;

    this.refresh();
  },

  methods: {
    addDevice(selected: Device) {
      if (this.zone) {
        const payload = { zoneid: this.zone.id, device: selected };
        this.$store.dispatch("addZoneDevice", payload);
        this.$store.dispatch("getZones");
      }
    },

    cancel() {
      if (this.zone) {
        this.profileid = this.zone.profileid;
        this.nickname = this.zone.nickname;
      }
      this.editing = false;
    },

    edit() {
      this.editing = true;
    },

    refresh() {
      console.log("refresh readings & statuses");
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

    removeDevice(selected: DeviceState) {
      if (this.zone) {
        const payload = { zoneid: this.zone.id, device: selected.device };
        this.$store.dispatch("removeZoneDevice", payload);
        this.$store.dispatch("getZones");
      }
    },

    save() {
      if (this.zone) {
        const zone = {
          id: this.zone.id,
          nickname: this.nickname,
          profileid: this.profileid
        };

        this.$store.dispatch("editZone", zone);
      }
      this.editing = false;
    },

    saveNickname(nickname: string) {
      if (this.zone) {
        const zone = {
          id: this.zone.id,
          nickname: nickname,
          profileid: this.profileid
        };

        this.$store.dispatch("editZone", zone);
      }
    },

    saveProfile(profileid: number) {
      if (this.zone) {
        const zone = {
          id: this.zone.id,
          nickname: this.nickname,
          profileid: profileid
        };

        this.$store.dispatch("editZone", zone);
      }
    }
  }
});

export default ZoneDetail;
</script>
