<template>
  <nav class="level is-mobile" @click="clicked">
    <div class="level-left">
      <div class="level-item">
        <div class="tags has-addons">
          <div class="tag has-background-black-bis">
            <strong>
              <span :style="dayStyle">{{ zone.nickname }}</span>
            </strong>
          </div>
          <div class="tag has-text-black-bis" :style="dayBackgroundStyle">
            <strong>{{ zone.profile.profile.slice(0, 12) }}</strong>
          </div>
        </div>
      </div>
    </div>
    <div class="level-right" v-if="zone.meters.length !== 0">
      <div class="level-item">
        <p class="title" :style="temperatureStyle">
          {{ temperature.toFixed(0) }}{{ unitsWithDegree }}
        </p>
      </div>
      <div class="level-item">
        <p class="title" :style="humidityStyle">{{ humidity.toFixed(0) }}%</p>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Zone } from "@/store/zones/types";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";
const ZoneNarrow = Vue.extend({
  props: {
    zone: Zone
  },

  data() {
    return {
      ts: new Date()
    };
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

    dayStyle(): string {
      if (this.zone.isDay(this.ts)) {
        return "color: #ffe08a;";
      } else {
        return "color: #7a7a7a;";
      }
    },

    dayBackgroundStyle(): string {
      if (this.zone.isDay(this.ts)) {
        return "background-color: #ffe08a;";
      } else {
        return "background-color: #7a7a7a;";
      }
    },

    temperatureStyle(): string {
      return `color: ${this.temperatureColor};`;
    },

    humidityStyle(): string {
      return `color: ${this.humidityColor};`;
    },

    lastupdate() {
      let last = null;
      this.zone.meters.forEach(meter => {
        const updatedat = new Date(meter.updatedat);
        if (last === null || updatedat > last) {
          last = updatedat;
        }
      });
      return last;
    },

    linkto(): string {
      return `#zone-details-${this.zone.id}`;
    },

    ...mapGetters("settings", ["settings"])
  },

  methods: {
    clicked() {
      console.log("clickety click", this.zone.nickname);
      this.$router.push({
        name: "zone",
        hash: this.linkto,
        params: { id: this.zone.id }
      });
    },

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

      const end = [35, 209, 96];
      const start = [];
      if (sign === -1) {
        start[0] = 32;
        start[1] = 156;
        start[2] = 238;
      } else {
        start[0] = 255;
        start[1] = 56;
        start[2] = 96;
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

export default ZoneNarrow;
</script>
