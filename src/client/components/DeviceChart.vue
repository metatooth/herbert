<template>
  <canvas id="devices" />
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import HTTP from "@/api/http";
import { convertToLocalTime } from "date-fns-timezone";
import ChartJS from "chart.js";
import "chartjs-adapter-date-fns";

const DeviceChart = Vue.extend({
  props: {
    devices: [],
  },

  data() {
    return {
      chart: ChartJS,
    };
  },

  computed: {
    ...mapGetters("settings", ["settings"]),
  },

  mounted() {
    const ctx = document.getElementById("devices");
    this.chart = new ChartJS(ctx, {
      type: "line",
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        elements: { point: { radius: 0 } },
        scales: {
          xAxes: [
            {
              display: true,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss",
              },
            },
          ],
          yAxes: [
            {
              display: true,
            },
          ],
        },
      },
    });

    const timeZone = this.settings.timezone;

    this.devices.forEach((d) => {
      if (d.devicetype === "irrigator" || d.devicetype === "lamp") {
        HTTP.get(`/facts?device=${d.device}&units=STATUS`).then((resp) => {
          const statuses = [];

          resp.data.forEach((d) => {
            const observedat = new Date(
              d.year,
              d.month - 1,
              d.date,
              d.hour,
              d.minute
            );

            const status = {
              x: convertToLocalTime(observedat, { timeZone }),
              y: d.reading as number,
            };
            statuses.push(status);
          });

          let color = "#00dd77";
          if (d.devicetype === "irrigator") {
            color = "#00bbee";
          }

          this.chart.data.datasets.push({
            data: statuses,
            borderColor: color,
            fill: false,
          });

          this.chart.update();
        });
      }
    });
  },
});

export default DeviceChart;
</script>

<style scoped></style>
