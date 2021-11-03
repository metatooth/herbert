<template>
  <nav class="level is-mobile" @click="clicked">
    <div class="level-left">
      <div class="level-item">
        <zone-tag :zone="zone" />
      </div>
    </div>
    <div class="level-right" v-if="zone.meters.length !== 0">
      <div class="level-item">
        <p class="title" :style="temperatureStyle">
          {{ temperature.toFixed(0) }}&#176;
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
import { celsius2fahrenheit, celsius2kelvin, color } from "../../shared/utils";
import ZoneTag from "@/components/ZoneTag.vue";

const ZoneNarrow = Vue.extend({
  props: {
    zone: Zone
  },

  components: {
    ZoneTag
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

    temperatureColor(): string {
      const diff =
        this.zone.meanTemperature() - this.zone.targetTemperature(this.ts);
      return color(diff, 3);
    },

    humidityColor(): string {
      const diff =
        100 * this.zone.meanHumidity() - this.zone.targetHumidity(this.ts);
      return color(diff, 5);
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
      this.$router.push({
        name: "zone",
        hash: this.linkto,
        params: { id: this.zone.id }
      });
    }
  }
});

export default ZoneNarrow;
</script>
