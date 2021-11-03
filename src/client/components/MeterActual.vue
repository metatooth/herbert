<template>
  <span>
    <span class="title"> {{ temperature.toFixed(0) }}&#176; </span>
    <span class="title"> {{ humidity.toFixed(0) }}% </span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import { Meter } from "@/store/meters/types";

import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";

const MeterActual = Vue.extend({
  props: {
    meter: Meter
  },

  data() {
    return {
      ts: new Date()
    };
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

    ...mapGetters("settings", ["settings"])
  }
});

export default MeterActual;
</script>
