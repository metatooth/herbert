<template>
  <div>
    <nav class="level">
      <div class="level-item">
        <temperature-fact :meter="meter" :width="width" :height="height" />
      </div>
      <div class="level-item">{{ temperature.toFixed(0) }}&#176;</div>
    </nav>
    <nav class="level">
      <div class="level-item">
        <humidity-fact :meter="meter" :width="width" :height="height" />
      </div>
      <div class="level-item">{{ humidity.toFixed(0) }}%</div>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import { Meter } from "@/store/meters/types";

import HumidityFact from "@/components/HumidityFact.vue";
import TemperatureFact from "@/components/TemperatureFact.vue";

import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";

const MeterActual = Vue.extend({
  props: {
    meter: Meter,
    units: String,
    width: { type: String, default: "300px" },
    height: { type: String, default: "50px" },
  },

  data() {
    return {
      ts: new Date(),
    };
  },

  components: {
    HumidityFact,
    TemperatureFact,
  },

  computed: {
    temperature(): number {
      if (this.settings.units === "F") {
        return celsius2fahrenheit(this.meter.temperature);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(this.meter.temperature);
      }

      return this.meter.temperature / 1;
    },

    humidity(): number {
      return this.meter.humidity * 100;
    },

    ...mapGetters("settings", ["settings"]),
  },
});

export default MeterActual;
</script>
