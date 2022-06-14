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
        <div class="level-right">
          <div class="level-item">
            <zone-status-button :zone="zone" :locked="locked" />
          </div>

          <div class="level-item" v-if="zone.meters.length !== 0">
            <p class="title" :style="temperatureStyle">
              {{ temperature.toFixed(0) }}&#176;
            </p>
          </div>
          <div class="level-item" v-if="zone.meters.length !== 0">
            <p class="title" :style="humidityStyle">
              {{ humidity.toFixed(0) }}%
            </p>
          </div>
        </div>
        <div class="level-left" />
      </nav>
    </div>

    <div class="card-content">
      <zone-chart :zone="zone" :units="settings.units" />
    </div>

    <div class="card-content">
      <narrow-table :items="zone.devices" :locked="locked" type="device" />
    </div>

    <div class="card-content">
      <narrow-table :items="zone.meters" type="meter" />
    </div>

    <div class="card-content">
      <div class="field is-grouped is-grouped-multiline">
        <div class="control">
          <div class="tags has-addons">
            <span
              class="tag has-background-grey-darker is-medium"
              :style="leafdiffStyle"
            >
              <font-awesome-icon icon="cannabis" />
            </span>
            <span class="tag has-text-black is-medium"
              >{{ lamponleafdiff.toFixed(1) }}&#176;</span
            >
          </div>
        </div>

        <div class="control" v-if="zone.children.length > 0">
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

<script lang="ts">
import Readable from "@/components/Readable.vue";
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import { mapGetters, mapActions } from "vuex";
import NarrowTable from "@/components/NarrowTable.vue";
import ZoneChart from "@/components/ZoneChart.vue";
import ZoneStatusButton from "@/components/ZoneStatusButton.vue";

import { celsius2fahrenheit, celsius2kelvin, color } from "../../shared/utils";

const ZoneDetail = Vue.extend({
  props: {
    zone: Zone,
    units: String,
    locked: Boolean
  },

  data() {
    let lampon = parseFloat(this.zone.lamponleafdiff);
    let lampoff = parseFloat(this.zone.lampoffleafdiff);

    if (this.units === "F") {
      lampon = (lampon * 9) / 5;
      lampoff = (lampoff * 9) / 5;
    }

    return {
      nickname: this.zone.nickname,
      profileid: parseInt(this.zone.profileid),
      maxirrigators: parseInt(this.zone.maxirrigators),
      lamponleafdiff: lampon,
      lampoffleafdiff: lampoff,
      now: new Date()
    };
  },

  components: {
    NarrowTable,
    Readable,
    ZoneChart,
    ZoneStatusButton
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
      this.zone.devices.forEach(d => {
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
    ...mapGetters("settings", ["settings"])
  },

  methods: {
    clickChild(zone) {
      this.$router.push({ name: "zone", params: { id: zone.id } });
    },

    clickDevice(device) {
      this.$router.push({
        name: "statuses",
        params: { name: device.name, device: device.device }
      });
    },

    clickMeter(meter) {
      this.$router.push({
        name: "readings",
        params: { name: meter.name, device: meter.device }
      });
    },

    deviceClass(device) {
      return `tag has-background-grey-darker is-medium ${device.textClass}`;
    },

    lookupZone(id: string) {
      const found = this.zones.filter(z => {
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
      "removeChild"
    ])
  }
});

export default ZoneDetail;
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
