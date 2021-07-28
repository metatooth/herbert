<template>
  <div id="readings">
    <section class="section">
      <back-to-dashboard />
    </section>
    <section class="section">
      <h2 class="title">{{ $route.params.name }} Meter Reading</h2>
      <h2 class="subtitle">{{ $route.params.device }}</h2>

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
          <temperature-chart id="tempchart" v-bind:data="temperatures" />
        </div>
        <div class="column is-half">
          <chart
            id="humiditychart"
            v-bind:data="humidities"
            title="Relative Humidity"
            label="Percent (%)"
            v-bind:suggestedMin="min"
            v-bind:suggestedMax="max"
            v-bind:stepSize="1"
          />
        </div>
      </div>

      <div class="columns">
        <div class="column is-half">
          <chart
            id="pressurechart"
            v-bind:data="pressures"
            title="Vapor Pressure Deficit"
            label="hectopascals (hPa)"
            v-bind:suggestedMin="0"
            v-bind:suggestedMax="3"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Chart from "@/components/Chart.vue";
import TemperatureChart from "@/components/TemperatureChart.vue";
import { convertToLocalTime } from "date-fns-timezone";
import BackToDashboard from "@/components/BackToDashboard.vue";

interface MeterReading {
  x: Date;
  y: number;
}

const Readings = Vue.extend({
  data() {
    return {
      range: "hour",
      temperatures: [] as MeterReading[],
      humidities: [] as MeterReading[],
      pressures: [] as MeterReading[],
      min: 100,
      max: 0
    };
  },

  components: {
    BackToDashboard,
    Chart,
    TemperatureChart
  },

  mounted() {
    this.refresh();
  },

  watch: {
    range() {
      this.refresh();
    }
  },

  methods: {
    refresh() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL;

      xhr.open(
        "GET",
        `${url}/readings/?meter=${this.$route.params.device}&last=${this.range}`
      );

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (!data.error) {
          this.temperatures = [];
          this.humidities = [];
          const timeZone = "America/New_York";
          data.forEach(
            (d: {
              observedat: Date;
              temperature: number;
              humidity: number;
              pressure: number;
            }) => {
              const ts = convertToLocalTime(d.observedat, { timeZone });
              const temperature = {
                x: ts,
                y: d.temperature as number
              };
              const humidity = {
                x: ts,
                y: 100 * d.humidity
              };

              if (humidity.y < this.min) {
                this.min = humidity.y;
              }

              if (humidity.y > this.max) {
                this.max = humidity.y;
              }

              const pressure = {
                x: ts,
                y: d.pressure / 1000
              };

              this.temperatures.push(temperature);
              this.humidities.push(humidity);
              this.pressures.push(pressure);
            }
          );
        }
      };

      xhr.send();
    }
  }
});
export default Readings;
</script>
