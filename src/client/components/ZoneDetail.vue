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
          <target
            icon="thermometer-half"
            :value="meanTemperature"
            :precision="1"
            :units="unitsWithDegree"
            :color="meanTemperatureColor"
          />

          <target
            icon="tint"
            :value="meanHumidity"
            :precision="0"
            units="%"
            :color="meanHumidityColor"
          />

          <target
            icon="cloud"
            :value="meanPressure"
            :precision="1"
            units="hPa"
            :color="meanPressureColor"
          />
        </div>
      </div>

      <div class="card-content">
        <div class="field is-grouped">
          <div class="control">
            <span class="tag is-medium">Target</span>
          </div>
          <target
            icon="thermometer-half"
            :value="targetTemperature"
            :precision="1"
            :units="unitsWithDegree"
            :color="targetColor"
          />

          <target
            icon="tint"
            :value="targetHumidity"
            :precision="0"
            units="%"
            :color="targetColor"
          />

          <target
            icon="cloud"
            :value="targetPressure"
            :precision="1"
            units="hPa"
            :color="targetColor"
          />
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
            v-for="device in zoneMeters"
            :key="device.device"
            :device="device"
            :units="units"
            @remove-device="remove"
          />
        </div>
      </div>

      <div class="card-content">
        <div class="field is-grouped is-grouped-multiline">
          <device-widget
            v-for="device in zoneSwitches"
            :key="device.device"
            :device="device"
            @remove-device="remove"
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
import Target from "@/components/Target.vue";

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
    Target,
    Timestamp
  },

  computed: {
    isDay(): boolean {
      let day = true;

      if (this.zone.profile) {
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
        sum = sum + parseFloat(reading.temperature);
      });
      const mean = sum / this.readings.length;
      return this.units === "F" ? celsius2fahrenheit(mean) : mean;
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

    meanTemperatureColor(): string {
      if (this.meanTemperature < this.targetTemperature) {
        return "info";
      } else if (this.meanTemperature > this.targetTemperature) {
        return "danger";
      } else {
        return "success";
      }
    },

    meanHumidityColor(): string {
      if (this.meanHumidity < this.targetHumidity) {
        return "info";
      } else if (this.meanHumidity > this.targetHumidity) {
        return "danger";
      } else {
        return "success";
      }
    },

    meanPressureColor(): string {
      if (this.meanPressure < this.targetPressure) {
        return "info";
      } else if (this.meanPressure > this.targetPressure) {
        return "danger";
      } else {
        return "success";
      }
    },

    targetColor(): string {
      return this.isDay ? "warning" : "info";
    },

    targetTemperature(): number {
      const target = this.isDay
        ? this.zone.profile.lampontemperature
        : this.zone.profile.lampofftemperature;

      return this.units === "F"
        ? celsius2fahrenheit(target)
        : parseFloat(target);
    },

    targetHumidity(): number {
      const target = this.isDay
        ? this.zone.profile.lamponhumidity
        : this.zone.profile.lampoffhumidity;

      return parseFloat(target);
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
      const result = this.zone.devices;
      const filter = (event: Device) => {
        return event.devicetype === "meter";
      };
      return result.filter(filter);
    },

    zoneSwitches(): Device[] {
      const result = this.zone.devices;
      const filter = (event: Device) => {
        return event.devicetype !== "meter";
      };
      return result.filter(filter);
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
        profileid: this.zone.profileid
      };

      this.edit(zone);
    },

    saveProfile(profile) {
      console.log("save profile", profile);

      const zone = {
        id: this.zone.id,
        nickname: this.zone.nickname,
        profileid: profile
      };

      console.log("zone", zone);

      this.edit(zone);
    },

    ...mapActions("zones", ["addDevice", "edit", "fetchData", "removeDevice"])
  }
});

export default ZoneDetail;
</script>
