<template>
  <div class="card-content">
    <div class="field is-grouped">
      <target
        icon="thermometer-half"
        :value="temperature"
        :precision="1"
        :units="unitsWithDegree"
        :color="color"
      />

      <target
        icon="tint"
        :value="humidity"
        :precision="0"
        units="%"
        :color="color"
      />

      <target
        icon="cloud"
        :value="pressure"
        :precision="1"
        units="hPa"
        :color="color"
      />
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
      return this.zone.isDay(this.ts) ? "warning" : "info";
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
      return this.zone.targetPressure(this.ts);
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    }
  }
});

export default ZoneTarget;
</script>
