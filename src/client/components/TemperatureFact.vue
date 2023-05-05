<template>
  <sparkline-display
    :id="id"
    :data="temperatures"
    color="rgb(255,119,0)"
    :width="width"
    :height="height"
  />
</template>

<script lang="ts">
import Vue from "vue";

import { Meter } from "@/store/meters/types";

import SparklineDisplay from "@/components/SparklineDisplay.vue";

import { convertToLocalTime } from "date-fns-timezone";

interface Fact {
  x: Date;
  y: number;
}

const TemperatureFact = Vue.extend({
  props: {
    meter: Meter,
    width: { type: String, default: "300px" },
    height: { type: String, default: "50px" },
  },

  data() {
    return {
      temperatures: [] as Fact[],
    };
  },

  components: {
    SparklineDisplay,
  },

  mounted() {
    this.refresh();
  },

  computed: {
    id() {
      return `${this.meter.device}-temperature`;
    },
  },

  methods: {
    refresh() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL;

      xhr.open("GET", `${url}/facts/?meter=${this.meter.device}&units=CELSIUS`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (!data.error) {
          this.temperatures = [];
          const timeZone = "America/New_York";
          data.forEach(
            (d: {
              year: string;
              month: string;
              date: string;
              hour: string;
              minute: string;
              reading: string;
            }) => {
              const observedat = new Date(
                d.year,
                d.month - 1,
                d.date,
                d.hour,
                d.minute
              );
              const temperature = {
                x: convertToLocalTime(observedat, { timeZone }),
                y: d.reading as number,
              };

              this.temperatures.push(temperature);
            }
          );
        }
      };

      xhr.send();
    },
  },
});

export default TemperatureFact;
</script>

<style></style>
