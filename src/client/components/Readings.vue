<template>
  <div>
    <section class="section">
      <h2 class="title">{{ $route.params.environment }}</h2>
      <h2 class="subtitle">{{ $route.params.name }} Meter Reading</h2>

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
          <temperature-chart
            id="tempchart"
            v-bind:data="temperatures"
          />
        </div>
        <div class="column is-half">
          <chart
            id="humiditychart"
            v-bind:data="humidities"
            title="Relative Humidity"
            label="Percent (%)"
            v-bind:suggestedMin="20"
            v-bind:suggestedMax="80"
          />
        </div>
      </div>
      <h2 class="subtitle is-code">{{ $route.params.meter }}</h2>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Chart from "@/components/Chart.vue";
import TemperatureChart from "@/components/TemperatureChart.vue";
import { convertToLocalTime } from "date-fns-timezone";

const Readings = Vue.extend({
  props: {
    name: { type: String, default: "" },
  },

  data() {
    return {
      range: 'hour',
      temperatures: [],
      humidities: [],
      units: "F"
    };
  },

  components: {
    Chart,
    TemperatureChart
  },
  
  mounted() {
    this.refresh();
  },

  watch: {
    range(val, oldVal) {
      console.log('range', oldVal, 'to', val);
      this.refresh();
    }
  },
  
  methods: {
    changeUnits(units) {
      this.units = units;
    },

    refresh() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL || "http://localhost:5000";
      
      xhr.open("GET",
               `${url}/readings/${this.$route.params.meter}?last=${this.range}`);
      
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (!data.error) {
          this.temperatures = [];
        this.humidities = [];
          data.forEach(d => {
            const ts = convertToLocalTime(d.timestamp, { timeZone: "Etc/UTC" });
            this.temperatures.push({ x: ts, y: d.temperature });
            this.humidities.push({ x: ts, y: 100 * d.humidity });
          });
        }
      };
      
      xhr.send();
    }
  }
});
export default Readings;
</script>
