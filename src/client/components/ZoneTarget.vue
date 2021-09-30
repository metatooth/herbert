<template>
  <div class="card-content">
    <div class="field is-grouped">
      <target
        icon="thermometer-half"
        :value="temperature"
        :units="unitsWithDegree"
        :color="color"
      />

      <target icon="tint" :value="humidity" units="%" :color="color" />

      <target icon="cloud" :value="pressure" units="hPa" :color="color" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import Target from "@/components/Target.vue";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";

const ZoneTarget = Vue.extend({
  props: {
    zone: Zone,
    units: String
  },

  data() {
    return {
      ts: new Date()
    };
  },

  components: {
    Target
  },

  computed: {
    color(): string {
      return this.zone.isDay(this.ts) ? "#ffe08a" : "#3e8ed0";
    },

    temperature(): number {
      const target = this.zone.targetTemperature(this.ts);
      if (this.units === "F") {
        return celsius2fahrenheit(target);
      } else if (this.units === "K") {
        return celsius2kelvin(target);
      }
      return target;
    },

    humidity(): number {
      return this.zone.targetHumidity(this.ts);
    },

    pressure(): number {
      return this.zone.targetPressure(this.ts) * 10;
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    }
  }
});

export default ZoneTarget;
</script>
