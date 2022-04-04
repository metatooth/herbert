<template>
  <sparkline
    :id="id"
    :data="statuses"
    color="rgb(255,119,0)"
    :width="width"
    :height="height"
  />
</template>

<script lang="ts">
import Vue from "vue";

import { Device } from "@/store/meters/types";

import Sparkline from "@/components/Sparkline.vue";

import { convertToLocalTime } from "date-fns-timezone";

interface Fact {
  x: Date;
  y: number;
}

const StatusFact = Vue.extend({
  props: {
    device: Device,
    width: { type: String, default: "300px" },
    height: { type: String, default: "50px" }
  },

  data() {
    return {
      statuses: [] as Fact[]
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
      return `${this.device.device}-status`;
    }
  },

  methods: {
    refresh() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL;

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
                d.year,
                d.month - 1,
                d.date,
                d.hour,
                d.minute
              );
              const temperature = {
                x: convertToLocalTime(observedat, { timeZone }),
                y: d.reading as number
              };

              this.statuses.push(temperature);
            }
          );
        }
      };

      xhr.send();
    }
  }
});

export default StatusFact;
</script>

<style></style>
