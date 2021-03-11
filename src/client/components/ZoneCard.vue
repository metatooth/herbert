<template>
  <div :id="anchor" class="column">
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
        </div>
      </div>

      <div class="card-content">
        <select-profile
          label="Growing"
          v-bind:profile="profile"
          v-bind:profiles="profiles"
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
  </div>
</template>

<script lang="ts">
import EditText from "@/components/EditText";
import HTTP from "@/api/http";
import SelectDevice from "@/components/SelectDevice";
import SelectProfile from "@/components/SelectProfile";
import Timestamp from "@/components/Timestamp";
import Vue from "vue";
import { LampTimer } from "../../shared/lamp-timer";
import { celsius2fahrenheit } from "../../shared/utils";

const ZoneCard = Vue.extend({
  props: {
    zone: Object,
    zones: Array,
    profiles: Array,
    devices: Array,
    units: String
  },

  data() {
    return {
      profileid: this.zone.profileid,
      profile: this.zone.profile,
      parentid: this.zone.parentid,
      parent: this.zone.parent,
      nickname: this.zone.nickname,
      readings: [],
      statuses: [],
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
      return this.zone.id + "config";
    },

    allMeters(): [] {
      const result = this.devices;
      const filter = event => {
        return event.devicetype === "meter";
      };
      return result.filter(filter);
    },

    allSwitches(): [] {
      const result = this.devices;
      const filter = event => {
        return event.devicetype !== "meter";
      };
      return result.filter(filter);
    },

    isDay(): boolean {
      let day = true;
      if (this.zone.profile) {
        const start = this.zone.profile.lampstart.split(":");
        const duration = this.zone.profile.lampduration["hours"];

        const lamp = new LampTimer(parseInt(start[0]), duration);

        const now = new Date();
        const hour = now.getHours();
        console.log("Is daytime?", hour, lamp, lamp.isOn(hour));
        day = lamp.isOn(hour);
      }
      return day;
    },

    meanTemperature(): number {
      let sum = 0;
      this.readings.forEach(reading => {
        sum = sum + parseFloat(reading.temperature);
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
        sum = sum + parseFloat(reading.humidity);
      });
      return sum / this.readings.length;
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

      if (this.zone.profile) {
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
      if (this.zone.profile) {
        if (this.isDay) {
          target = parseFloat(this.zone.profile.lamponhumidity);
        } else {
          target = parseFloat(this.zone.profile.lampoffhumidity);
        }
      }
      return target;
    },

    temp(): number {
      if (this.units === "F") {
        return celsius2fahrenheit(this.zone.temperature);
      } else {
        return this.zone.temperature;
      }
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    },

    zoneMeters(): [] {
      const result = this.zone.devices;
      const filter = event => {
        return event.devicetype === "meter";
      };
      return result.filter(filter);
    },

    zoneSwitches(): [] {
      const result = this.zone.devices;
      const filter = event => {
        return event.devicetype !== "meter";
      };
      return result.filter(filter);
    }
  },

  mounted() {
    this.refresh();
  },

  methods: {
    addDevice(selected) {
      const payload = { zoneid: this.zone.id, device: selected };
      this.$store.dispatch("addZoneDevice", payload);
      this.$store.dispatch("getZones");
    },

    cancel() {
      this.profileid = this.zone.profileid;
      this.profile = this.zone.profile;
      this.parentid = this.zone.parentid;
      this.parent = this.zone.parent;
      this.nickname = this.zone.nickname;
      this.editing = false;
    },

    edit() {
      this.editing = true;
    },

    refresh() {
      console.log("refresh readings & statuses");
      this.readings = [];
      this.statuses = [];

      this.zone.devices.forEach(device => {
        if (device.devicetype === "meter") {
          HTTP.get(`/readings?meter=${device.device}&last=one`).then(res => {
            this.readings.push(res.data);
          });
        } else {
          HTTP.get(`/statuses?device=${device.device}&last=one`).then(res => {
            this.statuses.push(res.data);
          });
        }
      });

      setTimeout(this.refresh, 30000);
    },

    removeDevice(selected) {
      const payload = { zoneid: this.zone.id, device: selected };
      this.$store.dispatch("removeZoneDevice", payload);
      this.$store.dispatch("getZones");
    },

    save() {
      const parent = this.zones.find(el => el.id === this.parentid);
      const profile = this.profiles.find(el => el.id === this.profileid);

      const zone = {
        id: this.zone.id,
        nickname: this.nickname,
        profileid: this.profileid,
        profile: profile.profile,
        parentid: this.parentid,
        parent: parent.nickname
      };

      this.$store.dispatch("editZone", zone);
      this.editing = false;
    },

    saveNickname(nickname) {
      const parent = this.zones.find(el => el.id === this.parentid);
      const profile = this.profiles.find(el => el.id === this.profileid);

      const zone = {
        id: this.zone.id,
        nickname: nickname,
        profileid: this.profileid,
        profile: profile.profile,
        parentid: this.parentid,
        parent: parent.nickname
      };

      this.$store.dispatch("editZone", zone);
    },

    saveProfile(profileid) {
      const parent = this.zones.find(el => el.id === this.parentid);
      const profile = this.profiles.find(el => el.id === profileid);

      const zone = {
        id: this.zone.id,
        nickname: this.nickname,
        profileid: profileid,
        profile: profile.profile,
        parentid: this.parentid,
        parent: parent.nickname
      };

      this.$store.dispatch("editZone", zone);
    }
  }
});

export default ZoneCard;
</script>
