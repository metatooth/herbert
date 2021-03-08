<template>
  <div :id="anchor" class="column">
    <div class="card">
      <div class="card-content">
        <a v-on:click="edit" v-if="!editing">
          <span v-if="zone.nickname">{{ zone.nickname }}</span>
          <span v-else>click to name</span>
        </a>
        <div class="field" v-else>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="nickname"
              @keyup.esc="cancel"
            />
          </div>
        </div>
      </div>

      <div class="card-content">
        <a v-on:click="edit" v-if="!editing">
          <span v-if="zone.profile">{{ zone.profile.profile }}</span>
          <span v-else>click to assign profile</span>
        </a>
        <div class="field" v-else>
          <div class="control">
            <div class="select">
              <select v-model="profileid">
                <option
                  v-for="profile in profiles"
                  v-bind:key="profile.id"
                  v-bind:value="profile.id"
                >
                  {{ profile.profile }}
                </option>
              </select>
            </div>
          </div>
        </div>
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

      <div class="card-content">
        <p class="card-header-subtitle">
          Status
        </p>
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
import Vue from "vue";

import Timestamp from "@/components/Timestamp.vue";
import { celsius2fahrenheit } from "../../shared/utils";
import SelectDevice from "@/components/SelectDevice";

const ZoneCard = Vue.extend({
  props: {
    zone: Object,
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
      editing: false
    };
  },

  components: {
    SelectDevice,
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

  methods: {
    addDevice(selected) {
      const payload = { zoneid: this.zone.id, device: selected };
      this.$store.dispatch("addZoneDevice", payload);
      this.$store.dispatch("getZones");
    },

    removeDevice(selected) {
      const payload = { zoneid: this.zone.id, device: selected };
      this.$store.dispatch("removeZoneDevice", payload);
      this.$store.dispatch("getZones");
    },

    edit() {
      this.editing = true;
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

    cancel() {
      this.profileid = this.zone.profileid;
      this.profile = this.zone.profile;
      this.parentid = this.zone.parentid;
      this.parent = this.zone.parent;
      this.nickname = this.zone.nickname;
      this.editing = false;
    }
  }
});

export default ZoneCard;
</script>
