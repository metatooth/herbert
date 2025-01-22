<script lang="ts">
import { mapGetters } from "vuex";

import { Zone } from "@client/store/zones/types";
import { celsius2fahrenheit, celsius2kelvin } from "@shared/utils";

export default {
  props: {
    zone: Zone,
  },

  data() {
    return {
      ts: new Date(),
    };
  },

  computed: {
    color(): string {
      return this.zone.isDay(this.ts) ? "#ffe08a" : "#7a7a7a";
    },

    style(): string {
      return `color: ${this.color};`;
    },

    temperature(): number {
      const target = this.zone.targetTemperature(this.ts);
      if (this.settings.units === "F") {
        return celsius2fahrenheit(target);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(target);
      }
      return target;
    },

    humidity(): number {
      return this.zone.targetHumidity(this.ts);
    },

    ...mapGetters("settings", ["settings"]),
  },
};
</script>

<template>
  <span>
    <span class="title" :style="style">
      {{ temperature.toFixed(0) }}&#176;
    </span>
    <span class="title" :style="style"> {{ humidity.toFixed(0) }}% </span>
  </span>
</template>
