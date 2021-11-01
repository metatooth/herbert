<template>
  <nav class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <p class="subtitle is-7">
          <strong>{{ meter.name.slice(0, 12) }}</strong
          ><br />
          {{ meter.device.slice(9) }}
        </p>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <p class="title">{{ temperature.toFixed(0) }}{{ unitsWithDegree }}</p>
      </div>
      <div class="level-item">
        <p class="title">{{ humidity.toFixed(0) }}%</p>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Meter } from "@/store/meters/types";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";
const MeterNarrow = Vue.extend({
  props: {
    meter: Meter
  },

  computed: {
    temperature(): number {
      const temp = this.meter.temperature * 1;
      if (this.settings.units === "F") {
        return celsius2fahrenheit(temp);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(temp);
      }
      return temp;
    },

    humidity(): number {
      return this.meter.humidity * 100;
    },

    unitsWithDegree(): string {
      return "°" + this.settings.units;
    },

    ...mapGetters("settings", ["settings"])
  }
});

export default MeterNarrow;
</script>
