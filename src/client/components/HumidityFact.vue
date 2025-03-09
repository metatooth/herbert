<script lang="ts">
import { convertToLocalTime } from "@shared/utils";

import SparklineDisplay from "@client/components/SparklineDisplay.vue";
import { Meter } from "@client/store/meters/types";

export default {
  components: {
    SparklineDisplay,
  },

  props: {
    meter: Meter,
  },

  data() {
    return {
      humidities: [],
    };
  },

  computed: {
    id() {
      return `${this.meter.device}-humidity`;
    },
  },

  mounted() {
    this.refresh();
  },

  methods: {
    refresh() {
      const xhr = new XMLHttpRequest();
      const url = import.meta.env.VITE_API_URL;

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
                parseInt(d.year),
                parseInt(d.month) - 1,
                parseInt(d.date),
                parseInt(d.hour),
                parseInt(d.minute),
              );

              const humidity = {
                x: convertToLocalTime(observedat, { timeZone }),
                y: parseFloat(d.reading),
              };

              this.humidities.push(humidity);
            },
          );
        }
      };

      xhr.send();
    },
  },
};
</script>

<template>
  <sparkline-display :id="id" :data="humidities" color="rgb(0,187,238)" />
</template>
