<script lang="ts">
import { mapGetters, mapActions } from "vuex";

import { celsius2fahrenheit, celsius2kelvin, color } from "@shared/utils";

import NarrowTable from "@client/components/NarrowTable.vue";
import Readable from "@client/components/Readable.vue";
import ZoneStatusButton from "@client/components/ZoneStatusButton.vue";
import { Zone } from "@client/store/zones/types";

export default {
  components: {
    NarrowTable,
    Readable,
    ZoneStatusButton,
  },

  props: {
    zone: Zone,
    units: { type: String, default: "" },
  },

  data() {
    return {
      nickname: this.zone.nickname,
      profileid: this.zone.profileid,
      maxirrigators: this.zone.maxirrigators,
      now: new Date(),
    };
  },

  computed: {
    activeIcon() {
      if (this.zone.active) {
        return "toggle-on";
      } else {
        return "toggle-off";
      }
    },

    activeClass() {
      if (this.zone.active) {
        return "has-text-success";
      } else {
        return "has-text-info";
      }
    },

    humidity(): number {
      return this.zone.meanHumidity() * 100;
    },

    humidityColor(): string {
      const diff =
        100 * this.zone.meanHumidity() - this.zone.targetHumidity(this.now);
      return color(diff, 5);
    },

    humidityStyle(): string {
      return `color: ${this.humidityColor};`;
    },

    isDay() {
      return this.zone.isDay(new Date());
    },

    lastupdate() {
      let lastupdate;
      this.zone.devices.forEach((d) => {
        if (d.updatedat < lastupdate) lastupdate = d.updatedat;
      });
      return lastupdate;
    },

    leafdiffStyle() {
      if (this.isDay) {
        return "color: #ffe08a";
      } else {
        return "color: #7a7a7a";
      }
    },

    linkto() {
      return `#zone-details-${this.zone.id}`;
    },

    temperature(): number {
      const mean = this.zone.meanTemperature();
      if (this.settings.units === "F") {
        return celsius2fahrenheit(mean);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(mean);
      }
      return mean;
    },

    temperatureColor(): string {
      const diff =
        this.zone.meanTemperature() - this.zone.targetTemperature(this.now);
      return color(diff, 3);
    },

    temperatureStyle(): string {
      return `color: ${this.temperatureColor};`;
    },

    ...mapGetters("devices", ["devices"]),
    ...mapGetters("meters", ["meters"]),
    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("zones", ["zones"]),
    ...mapGetters("settings", ["settings"]),
  },

  methods: {
    clickChild(zone) {
      this.$router.push({ name: "zone", params: { id: zone.id } });
    },

    clickDevice(device) {
      this.$router.push({
        name: "statuses",
        params: { name: device.name, device: device.device },
      });
    },

    clickMeter(meter) {
      this.$router.push({
        name: "readings",
        params: { name: meter.name, device: meter.device },
      });
    },

    deviceClass(device) {
      return `tag has-background-grey-darker is-medium ${device.textClass}`;
    },

    lookupZone(id: string) {
      const found = this.zones.filter((z) => {
        return z.id === id;
      });
      return found[0];
    },

    ...mapActions("zones", [
      "addDevice",
      "addChild",
      "edit",
      "fetchData",
      "removeDevice",
      "removeChild",
    ]),
  },
};
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="card-header-title">
        <div class="title">{{ zone.nickname }}</div>
        <div class="subtitle">{{ zone.profile.profile }}</div>
      </div>
    </div>

    <div class="card-content">
      <nav class="level is-mobile">
        <div class="level-item">
          <zone-status-button :zone="zone" :locked="false" />
        </div>

        <div v-if="zone.meters.length !== 0" class="level-item">
          <p class="title" :style="temperatureStyle">
            {{ temperature.toFixed(0) }}&#176;
          </p>
        </div>
        <div v-if="zone.meters.length !== 0" class="level-item">
          <p class="title" :style="humidityStyle">{{ humidity.toFixed(0) }}%</p>
        </div>
      </nav>
    </div>

    <div class="card-content">
      <narrow-table :items="zone.devices" type="device" />
    </div>

    <div class="card-content">
      <narrow-table :items="zone.meters" type="meter" />
    </div>

    <div class="card-content">
      <div class="field is-grouped is-grouped-multiline">
        <div v-if="zone.children.length > 0" class="control">
          <div class="tags has-addons">
            <span
              class="tag has-background-grey-darker has-text-info is-medium"
            >
              <font-awesome-icon icon="cloud-rain" />
            </span>
            <span class="tag has-text-black is-medium"
              >{{ maxirrigators }} max</span
            >
          </div>
        </div>
      </div>
    </div>

    <footer class="card-footer">
      <div class="card-footer-item">
        <readable class="is-italic" :timestamp="lastupdate" />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
