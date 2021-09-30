<template>
  <div class="field is-grouped is-grouped-multiline">
    <target
      icon="thermometer-half"
      :value="temperature"
      :units="unitsWithDegree"
      :color="temperatureColor"
    />

    <target icon="tint" :value="humidity" units="%" :color="humidityColor" />

    <target icon="cloud" :value="pressure" units="hPa" :color="pressureColor" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import Target from "@/components/Target.vue";
import { mapGetters } from "vuex";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";

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

    pressure(): number {
      return this.zone.meanPressure() * 10;
    },

    unitsWithDegree(): string {
      return "°" + this.settings.units;
    },

    temperatureColor(): string {
      const diff =
        this.zone.meanTemperature() - this.zone.targetTemperature(this.ts);
      return this.color(diff, 3);
    },

    humidityColor(): string {
      const diff =
        100 * this.zone.meanHumidity() - this.zone.targetHumidity(this.ts);
      return this.color(diff, 5);
    },

    pressureColor(): string {
      const diff = this.zone.meanPressure() - this.zone.targetPressure(this.ts);
      return this.color(diff, 0.3);
    },

    ...mapGetters("settings", ["settings"])
  },

  methods: {
    hex(c): string {
      const s = "0123456789abcdef";
      let i = parseInt(c);
      if (i == 0 || isNaN(c)) {
        return "00";
      }
      i = Math.round(Math.min(Math.max(0, i), 255));
      return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
    },

    convertToHex(rgb): string {
      return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
    },

    color(diff, range): string {
      let sign = 1;
      if (diff < 0) {
        sign = -1;
      }

      let alpha = Math.floor((100 * sign * diff) / range) / 100;
      alpha = alpha > 1 ? 1 : alpha;

      const end = [772, 199, 142];
      const start = [];
      if (sign === -1) {
        start[0] = 62;
        start[1] = 142;
        start[2] = 208;
      } else {
        start[0] = 241;
        start[1] = 70;
        start[2] = 104;
      }

      const c = [
        start[0] * alpha + (1 - alpha) * end[0],
        start[1] * alpha + (1 - alpha) * end[1],
        start[2] * alpha + (1 - alpha) * end[2]
      ];

      return "#" + this.convertToHex(c);
    }
  }
});

export default ZoneActual;
</script>
