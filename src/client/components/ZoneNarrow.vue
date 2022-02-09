<template>
  <nav class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <div class="tag has-background-black-bis is-medium" :style="iconStyle">
          <span class="icon">
            <font-awesome-icon icon="lightbulb" />
          </span>
        </div>
      </div>
      <div class="level-item" @click="clicked">
        <div class="content">
          <p class="title is-5">
            {{ zone.shortname }}
          </p>
          <p class="subtitle is-7">
            {{ zone.profile.profile }}
          </p>
        </div>
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

const ZoneNarrow = Vue.extend({
  props: {
    zone: Zone
  },

  data() {
    return {
      now: new Date()
    };
  },

  computed: {
    humidity(): number {
      return this.zone.meanHumidity() * 100;
    },

    humidityColor(): string {
      const diff =
        100 * this.zone.meanHumidity() - this.zone.targetHumidity(this.now);
      return color(diff, 5);
    },

    humidityStyle(): string {
      return `color: ${this.humidityColor};`;
    },

    iconStyle() {
      if (this.zone.isDay(this.now)) {
        return "color: #ffe08a;";
      } else {
        return "color: #7a7a7a;";
      }
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

    temperature(): number {
      const mean = this.zone.meanTemperature();
      if (this.settings.units === "F") {
        return celsius2fahrenheit(mean);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(mean);
      }
      return mean;
    },

    temperatureColor(): string {
      const diff =
        this.zone.meanTemperature() - this.zone.targetTemperature(this.now);
      return color(diff, 3);
    },

    temperatureStyle(): string {
      return `color: ${this.temperatureColor};`;
    },

    ...mapGetters("settings", ["settings"])
  },

  methods: {
    clicked() {
      this.$router.push({
        name: "zone",
        params: { id: this.zone.id }
      });
    }
  }
});

export default ZoneNarrow;
</script>
