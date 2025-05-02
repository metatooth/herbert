<script lang="ts">
import Target from "@client/components/Target.vue";
import { Zone } from "@client/store/zones/types";

export default {
  components: {
    Target,
  },

  props: {
    zone: Zone,
    units: String,
  },

  data() {
    return {
      ts: new Date(),
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
    },
  },
};
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
