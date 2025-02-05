<script lang="ts">
import ChartBase from "@client/components/ChartBase.vue";
import TemperatureChart from "@client/components/TemperatureChart.vue";
import BackToDashboard from "@client/components/BackToDashboard.vue";

export default {
  components: {
    BackToDashboard,
    ChartBase,
    TemperatureChart,
  },

  data() {
    return {
      range: "hour",
      xhr: new XMLHttpRequest(),
      temperatures: [],
      humidities: [],
      pressures: [],
      min: 100,
      max: 0,
    };
  },

  computed: {
    device() {
      return this.$route.params.device;
    },

    name() {
      return this.$route.params.name;
    },
  },

  mounted() {
    this.xhr.onload = () => {
      const data = JSON.parse(this.xhr.response);

      if (data.error) {
        return;
      }

      this.temperatures = [];
      this.humidities = [];
      data.forEach((d) => {
        const temperature = {
          x: d.observedat,
          y: parseFloat(d.temperature),
        };

        const humidity = {
          x: d.observedat,
          y: 100 * d.humidity,
        };

        if (humidity.y < this.min) {
          this.min = humidity.y;
        }

        if (humidity.y > this.max) {
          this.max = humidity.y;
        }

        const pressure = {
          x: d.observedat,
          y: d.pressure / 1000,
        };

        this.temperatures.push(temperature);
        this.humidities.push(humidity);
        this.pressures.push(pressure);
      });
    };
  },

  watch: {
    range() {
      const url = "http://localhost:5000";

      this.xhr.open(
        "GET",
        `${url}/readings/?meter=${this.$route.params.device}&last=${this.range}`,
      );

      this.xhr.send();
    },
  },
};
</script>

<template>
  <div id="readings">
    <section class="section">
      <back-to-dashboard />
    </section>
    <section class="section">
      <h2 class="title">{{ name }} Meter Reading</h2>
      <h2 class="subtitle">
        {{ device }}
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
          <chart-base
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
          <chart-base
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
