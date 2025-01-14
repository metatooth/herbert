<script lang="ts">
import Vue from "vue";
import Chart from "@/components/Chart.vue";
import TemperatureChart from "@/components/TemperatureChart.vue";
import { convertToLocalTime } from "date-fns-timezone";
import BackToDashboard from "@/components/BackToDashboard.vue";

const Readings = Vue.extend({
  components: {
    BackToDashboard,
    Chart,
    TemperatureChart,
  },
  data() {
    return {
      range: "hour",
      temperatures: [],
      humidities: [],
      pressures: [],
      min: 100,
      max: 0,
    };
  },

  watch: {
    range() {
      this.refresh();
    },
  },

  mounted() {
    this.refresh();
  },

  methods: {
    refresh() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL;

      xhr.open(
        "GET",
        `${url}/readings/?meter=${this.$route.params.device}&last=${this.range}`,
      );

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (!data.error) {
          this.temperatures = [];
          this.humidities = [];
          const timeZone = "America/New_York";
          data.forEach((d) => {
            const ts = convertToLocalTime(d.observedat, { timeZone });
            const temperature = {
              x: ts,
              y: parseFloat(d.temperature),
            };
            const humidity = {
              x: ts,
              y: 100 * d.humidity,
            };

            if (humidity.y < this.min) {
              this.min = humidity.y;
            }

            if (humidity.y > this.max) {
              this.max = humidity.y;
            }

            const pressure = {
              x: ts,
              y: d.pressure / 1000,
            };

            this.temperatures.push(temperature);
            this.humidities.push(humidity);
            this.pressures.push(pressure);
          });
        }
      };

      xhr.send();
    },
  },
});
export default Readings;
</script>

<template>
  <div id="readings">
    <section class="section">
      <back-to-dashboard />
    </section>
    <section class="section">
      <h2 class="title">{{ $route.params.name }} Meter Reading</h2>
      <h2 class="subtitle">
        {{ $route.params.device }}
      </h2>

      <form class="control">
        Last&nbsp;
        <label for="year" class="radio">
          <input id="year" v-model="range" type="radio" value="year" />
          Year
        </label>
        &nbsp;
        <label for="month" class="radio">
          <input id="month" v-model="range" type="radio" value="month" />
          Month
        </label>
        &nbsp;
        <label for="week" class="radio">
          <input id="week" v-model="range" type="radio" value="week" />
          Week
        </label>
        &nbsp;
        <label for="day" class="radio">
          <input id="day" v-model="range" type="radio" value="day" />
          Day
        </label>
        &nbsp;
        <label for="hour" class="radio">
          <input id="hour" v-model="range" type="radio" value="hour" />
          Hour
        </label>
      </form>

      <div class="columns">
        <div class="column is-half">
          <temperature-chart id="tempchart" :data="temperatures" />
        </div>
        <div class="column is-half">
          <chart
            id="humiditychart"
            :data="humidities"
            title="Relative Humidity"
            label="Percent (%)"
            :suggested-min="min"
            :suggested-max="max"
            :step-size="1"
          />
        </div>
      </div>

      <div class="columns">
        <div class="column is-half">
          <chart
            id="pressurechart"
            :data="pressures"
            title="Vapor Pressure Deficit"
            label="hectopascals (hPa)"
            :suggested-min="0"
            :suggested-max="3"
          />
        </div>
      </div>
    </section>
  </div>
</template>
