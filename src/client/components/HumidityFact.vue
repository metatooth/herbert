<template>
  <sparkline :id="id" :data="humidities"> </sparkline>
</template>

<script lang="ts">
import Vue from "vue";

import { Meter } from "@/store/meters/types";

import Sparkline from "@/components/Sparkline.vue";

import { convertToLocalTime } from "date-fns-timezone";

const HumidityFact = Vue.extend({
  props: {
    meter: Meter
  },

  data() {
    return {
      humidities: []
    };
  },

  components: {
    Sparkline
  },

  mounted() {
    this.refresh();
  },

  computed: {
    id() {
      return `${this.meter.device}-humidity`;
    }
  },

  methods: {
    refresh() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL;

      xhr.open("GET", `${url}/facts/?meter=${this.meter.device}&units=%RH`);

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
                d.month,
                d.date,
                d.hour,
                d.minute
              );

              const humidity = {
                x: convertToLocalTime(observedat, { timeZone }),
                y: d.reading as number
              };

              this.humidities.push(humidity);
            }
          );
        }
      };

      xhr.send();
    }
  }
});

export default HumidityFact;
</script>

<style></style>
