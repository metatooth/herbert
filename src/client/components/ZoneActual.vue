<template>
  <span v-if="zone.meters.length > 0">
    <span class="title" :style="temperatureStyle">
      {{ temperature.toFixed(0) }}&#176;
    </span>
    <span class="title" :style="humidityStyle">
      {{ humidity.toFixed(0) }}%
    </span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import { mapGetters } from "vuex";
import { celsius2fahrenheit, celsius2kelvin, color } from "../../shared/utils";

const ZoneActual = Vue.extend({
  props: {
    zone: Zone,
    size: { type: String, default: "medium" },
  },

  data() {
    return {
      ts: new Date(),
    };
  },

  computed: {
    temperature(): number {
      const mean = this.zone.meanTemperature();
      if (this.settings.units === "F") {
        return celsius2fahrenheit(mean);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(mean);
      }
      return mean;
    },

    humidity(): number {
      return this.zone.meanHumidity() * 100;
    },

    temperatureColor(): string {
      const diff =
        this.zone.meanTemperature() - this.zone.targetTemperature(this.ts);
      return color(diff, 3);
    },

    humidityColor(): string {
      const diff =
        100 * this.zone.meanHumidity() - this.zone.targetHumidity(this.ts);
      return color(diff, 5);
    },

    temperatureStyle(): string {
      return `color: ${this.temperatureColor};`;
    },

    humidityStyle(): string {
      return `color: ${this.humidityColor};`;
    },

    ...mapGetters("settings", ["settings"]),
  },
});

export default ZoneActual;
</script>
