<template>
  <nav class="level">
    <div class="level-left" />
    <div class="level-right" v-if="ready">
      <div class="level-item">
        <p class="subtitle">
          {{ settings.cityname }}, {{ settings.statecode }}
        </p>
      </div>
      <div class="level-item">
        <p class="title">
          {{ main }}
        </p>
      </div>
      <div class="level-item">
        <p class="title">{{ temperature.toFixed(0) }}&#176;</p>
      </div>
      <div class="level-item">
        <p class="title">{{ humidity.toFixed(0) }}%</p>
      </div>
    </div>
    <div class="level-right" v-else>
      <div class="level-item">
        <p class="subtitle">
          Loading...
        </p>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import Openweathermap from "../api/openweathermap";

const CurrentConditions = Vue.extend({
  data() {
    return {
      ready: false,
      timestamp: Date,
      temperature: Number,
      humidity: Number,
      main: String
    };
  },

  computed: {
    hh() {
      return this.timestamp.getHours() < 12
        ? this.timestamp.getHours()
        : this.timestamp.getHours() - 12;
    },

    part() {
      return this.timestamp.getHours() < 12 ? "AM" : "PM";
    },

    hhmm() {
      return this.hh + ":" + this.timestamp.getMinutes() + " " + this.part;
    },

    monthdayyear() {
      const mon = this.timestamp.toLocaleString("default", { month: "long" });

      return (
        mon +
        " " +
        this.timestamp.getDay() +
        ", " +
        this.timestamp.getFullYear()
      );
    },

    ...mapGetters("settings", ["settings"])
  },

  mounted() {
    this.refresh();
  },

  methods: {
    refresh() {
      if (this.settings && this.settings.cityname) {
        const q = `${this.settings.cityname},${this.settings.statecode},USA`;
        let units = "standard";
        if (this.settings.units === "F") {
          units = "imperial";
        } else if (this.settings.units === "C") {
          units = "metric";
        }

        Openweathermap.get("/data/2.5/weather", {
          params: { q: q, units: units, appid: this.settings.openweather }
        }).then(res => {
          this.timestamp = new Date();
          this.temperature = res.data.main.temp;
          this.humidity = res.data.main.humidity;
          this.main = res.data.weather[0].main;
          this.ready = true;
        });
      }

      const refresh = this.settings.refresh ? this.settings.refresh : 1000;
      setTimeout(this.refresh, refresh);
    }
  }
});

export default CurrentConditions;
</script>

<style scoped>
.level {
  border-top-color: #efefef;
  border-top-width: 2px;
  border-top-style: solid;
}
</style>