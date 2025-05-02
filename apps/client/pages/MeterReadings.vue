<script lang="ts">
import { convertToLocalTime } from "@shared/utils";
import { mapGetters } from "vuex";

import ZoneChart from "@client/components/ZoneChart.vue";

export default {
  components: {
    ZoneChart,
  },
  data() {
    return {
      range: "day",
      temperatures: [],
      humidities: [],
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

    ...mapGetters("settings", ["settings"]),
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
      const url = import.meta.env.VITE_API_URL;
      const timeZone = this.settings.timezone;

      const temp = new XMLHttpRequest();

      temp.open(
        "GET",
        `${url}/facts?meter=${this.$route.params.device}&units=CELSIUS&last=${this.range}`,
      );

      temp.onload = () => {
        const data = JSON.parse(temp.response);
        if (!data.error) {
          this.temperatures = [];

          data.forEach((d) => {
            const observedat = new Date(
              d.year,
              d.month - 1,
              d.date,
              d.hour,
              d.minute,
            );

            const temperature = {
              x: convertToLocalTime(observedat, { timeZone }),
              y: parseFloat(d.reading),
            };

            this.temperatures.push(temperature);
          });
        }
      };

      const humid = new XMLHttpRequest();

      humid.open(
        "GET",
        `${url}/facts?meter=${this.$route.params.device}&units=%RH&last=${this.range}`,
      );

      humid.onload = () => {
        const data = JSON.parse(humid.response);
        if (!data.error) {
          this.humidities = [];

          data.forEach((d) => {
            const observedat = new Date(
              d.year,
              d.month - 1,
              d.date,
              d.hour,
              d.minute,
            );

            const humidity = {
              x: convertToLocalTime(observedat, { timeZone }),
              y: parseFloat(d.reading) * 100,
            };

            this.humidities.push(humidity);
          });
        }
      };

      temp.send();
      humid.send();
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="card-header-title">
        <p class="title">{{ name }} Meter Reading</p>
        <p class="subtitle">
          {{ device }}
        </p>
      </div>
      <div class="card-header-icon">
        <router-link :to="{ name: 'dashboard' }">
          <span class="icon">
            <font-awesome-icon icon="times-circle" />
          </span>
        </router-link>
      </div>
    </div>
    <div class="card-content">
      <form class="control">
        Last&nbsp;
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
        <label for="halfday" class="radio">
          <input id="halfday" v-model="range" type="radio" value="halfday" />
          Half Day
        </label>
        &nbsp;
        <label for="hour" class="radio">
          <input id="hour" v-model="range" type="radio" value="hour" />
          Hour
        </label>
      </form>

      <div class="columns">
        <div class="column is-half">
          <zone-chart
            id="temperaturechart"
            :data="temperatures"
            title="Temperature"
            label="Celius (C)"
            :suggested-min="min"
            :suggested-max="max"
            :step-size="1"
          />
        </div>
        <div class="column is-half">
          <zone-chart
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
    </div>
  </div>
</template>
