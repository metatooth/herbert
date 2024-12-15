<template>
  <canvas id="temperatures" />
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import HTTP from "@/api/http";
import { convertToLocalTime } from "date-fns-timezone";
import ChartJS from "chart.js";
import "chartjs-adapter-date-fns";

const TemperatureChart = Vue.extend({
  props: {
    meters: [],
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
    const ctx = document.getElementById("temperatures");
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

    this.meters.forEach((m) => {
      HTTP.get(`/facts?meter=${m.device}&units=CELSIUS`).then((resp) => {
        const temperatures = [];

        resp.data.forEach((d) => {
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
          temperatures.push(temperature);
        });

        let color = "#ff7700";
        if (m.manufacturer === "OpenWeather") {
          color = "#aa2200";
        }

        this.chart.data.datasets.push({
          data: temperatures,
          borderColor: color,
          fill: false,
        });

        this.chart.update();
      });
    });
  },
});

export default TemperatureChart;
</script>

<style scoped></style>
