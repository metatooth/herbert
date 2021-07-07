<template>
  <div class="field is-grouped is-grouped-multiline">
    <target
      icon="thermometer-half"
      :value="temperature"
      :precision="1"
      :units="unitsWithDegree"
      :color="temperatureColor"
    />

    <target
      icon="tint"
      :value="humidity"
      :precision="0"
      units="%"
      :color="humidityColor"
    />

    <target
      icon="cloud"
      :value="pressure"
      :precision="1"
      units="hPa"
      :color="pressureColor"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import Target from "@/components/Target.vue";
import { mapGetters } from "vuex";

const ZoneActual = Vue.extend({
  props: {
    zone: Zone
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
    temperature(): number {
      return this.zone.meanTemperature();
    },

    humidity(): number {
      return this.zone.meanHumidity() * 100;
    },

    pressure(): number {
      return this.zone.meanPressure();
    },

    unitsWithDegree(): string {
      return "°" + this.settings.units;
    },

    temperatureColor(): string {
      if (this.zone.meanTemperature() < this.zone.targetTemperature(this.ts)) {
        return "info";
      } else if (
        this.zone.meanTemperature() > this.zone.targetTemperature(this.ts)
      ) {
        return "danger";
      } else {
        return "success";
      }
    },

    humidityColor(): string {
      if (100 * this.zone.meanHumidity() < this.zone.targetHumidity(this.ts)) {
        return "info";
      } else if (
        100 * this.zone.meanHumidity() >
        this.zone.targetHumidity(this.ts)
      ) {
        return "danger";
      } else {
        return "success";
      }
    },

    pressureColor(): string {
      if (this.zone.meanPressure() < this.zone.targetPressure(this.ts)) {
        return "info";
      } else if (this.zone.meanPressure() > this.zone.targetPressure(this.ts)) {
        return "danger";
      } else {
        return "success";
      }
    },

    ...mapGetters("settings", ["settings"])
  }
});

export default ZoneActual;
</script>
