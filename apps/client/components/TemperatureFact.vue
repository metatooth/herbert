<script lang="ts">
import { convertToLocalTime } from "@shared/utils";

import { Meter, MeterFact } from "@client/store/meters/types";
import SparklineDisplay from "@client/components/SparklineDisplay.vue";

export default {
  components: {
    SparklineDisplay,
  },
  props: {
    meter: Meter,
    width: { type: String, default: "300px" },
    height: { type: String, default: "50px" },
  },

  data() {
    return {
      temperatures: new Array<MeterFact>(),
    };
  },

  computed: {
    id() {
      return `${this.meter.device}-temperature`;
    },
  },

  mounted() {
    this.refresh();
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
                parseInt(d.year),
                parseInt(d.month) - 1,
                parseInt(d.date),
                parseInt(d.hour),
                parseInt(d.minute),
              );
              const temperature = {
                x: convertToLocalTime(observedat, { timeZone }),
                y: parseFloat(d.reading),
              };

              this.temperatures.push(temperature);
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
  <sparkline-display
    :id="id"
    :data="temperatures"
    color="rgb(255,119,0)"
    :width="width"
    :height="height"
  />
</template>
