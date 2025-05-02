<script lang="ts">
import { convertToLocalTime } from "@shared/utils";

import SparklineDisplay from "@client/components/SparklineDisplay.vue";
import { Device, DeviceFact } from "@client/store/devices/types";

export default {
  components: {
    SparklineDisplay,
  },

  props: {
    device: Device,
    width: { type: String, default: "300px" },
    height: { type: String, default: "50px" },
  },

  data() {
    return {
      statuses: new Array<DeviceFact>(),
    };
  },

  computed: {
    id() {
      return `${this.device.device}-status`;
    },
  },

  mounted() {
    this.refresh();
  },

  methods: {
    refresh() {
      const xhr = new XMLHttpRequest();
      const url = import.meta.env.VITE_API_URL;

      xhr.open("GET", `${url}/facts/?meter=${this.device.device}&units=STATUS`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (!data.error) {
          this.statuses = [];
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

              this.statuses.push(temperature);
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
    :data="statuses"
    color="rgb(255,119,0)"
    :width="width"
    :height="height"
  />
</template>
