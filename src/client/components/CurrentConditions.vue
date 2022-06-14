<template>
  <div class="box">
    <div class="card">
      <div class="card-header">
        <p class="subtitle">
          {{ settings.cityname }}, {{ settings.statecode }}
        </p>
      </div>
      <div v-if="ready" class="card-content">
        <p class="title">{{ main }}</p>
        <p class="title">{{ temperature.toFixed(0) }}&#176;</p>
        <p class="title">{{ humidity.toFixed(0) }}%</p>
      </div>
      <div v-else class="card-content">
        <p class="subtitle">
          Loading...
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { io, Socket } from "socket.io-client";
import { makeMeterStatusMessage } from "../../shared/message-creators";

import Openweathermap from "../api/openweathermap";

const CurrentConditions = Vue.extend({
  data() {
    return {
      ready: false,
      timestamp: Date,
      temperature: Number,
      humidity: Number,
      main: String,
      socket: Socket
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
    this.socket = io(process.env.VUE_APP_WSS_URL);

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

          let mac = this.settings.openweather.slice(-12);
          mac = mac.replace(/(.{2})/g, "$1:");
          mac = mac
            .split(":")
            .slice(0, -1)
            .join(":");

          const msg = makeMeterStatusMessage({
            device: mac,
            type: "meter",
            manufacturer: "OpenWeather",
            temperature: this.temperature,
            humidity: this.humidity / 100,
            timestamp: new Date().toString()
          });

          this.socket.emit("message", msg);
        });
      }

      const refresh = this.settings.refresh ? this.settings.refresh : 60000;
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

.title, .subtitle {
  color: #00dd77;
}
</style>
