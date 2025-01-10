<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import Target from "@/components/Target.vue";

const MeterTarget = Vue.extend({
  components: {
    Target
  },

  props: {
    zone: Zone,
    units: string
  },

  data() {
    return {
      ts: new Date()
    };
  },

  computed: {
    color(): string {
      return this.zone.isDay(this.ts) ? "warning" : "info";
    },

    temperature(): number {
      return this.zone.targetTemperature(this.ts);
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

export default MeterTarget;
</script>

<template>
  <div class="card-content">
    <div class="field is-grouped">
      <div class="control">
        <span class="tag is-medium">Target</span>
      </div>
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
