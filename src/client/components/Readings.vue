<template>
  <div>
    <section class="section">
      <h2 class="title">{{ $route.params.environment }}</h2>
      <h2 class="subtitle">{{ $route.params.name }} Meter Reading</h2>
      <div class="columns">
        <div class="column is-half">
          <chart
            id="tempchart"
            v-bind:dataset="temperatures"
            title="Temperature"
            label="Celsius (°C)"
            v-bind:suggestedMin="15"
            v-bind:suggestedMax="30"
          />
        </div>
        <div class="column is-half">
          <chart
            id="humiditychart"
            v-bind:dataset="humidities"
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

<script>
import Vue from "vue";
import Chart from "@/components/Chart.vue";
import { convertToLocalTime } from "date-fns-timezone";

const Readings = Vue.extend({
  props: {
    name: { type: String, default: "" }
  },

  data() {
    return {
      temperatures: [],
      humidities: []
    };
  },

  components: {
    Chart
  },

  mounted() {
    const xhr = new XMLHttpRequest();
    const url = process.env.VUE_APP_API_URL || "ws://localhost:5000";
    
    xhr.open(
      "GET",
      `${url}/readings/${this.$route.params.meter}`
    );

    xhr.onload = () => {
      const data = JSON.parse(xhr.response);
      console.log("data has", data.length, "entries");
      data.forEach(d => {
        console.log(d.timestamp, d.temperature, d.humidity);
        const output = convertToLocalTime(d.timestamp, { timeZone: "Etc/UTC" });
        console.log(output);
        this.temperatures.push({ x: output, y: d.temperature });
        this.humidities.push({ x: output, y: 100 * d.humidity });
      });
    };

    xhr.send();
  }
});
export default Readings;
</script>
