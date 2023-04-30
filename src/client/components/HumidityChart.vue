<template>
  <canvas id="humidities" />
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import HTTP from "@/api/http";
import { convertToLocalTime } from "date-fns-timezone";
import ChartJS from "chart.js";
import "chartjs-adapter-date-fns";

const SystemHumidityChart = Vue.extend({
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
    const ctx = document.getElementById("humidities");
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
      HTTP.get(`/facts?meter=${m.device}&units=%RH`).then((resp) => {
        const humidities = [];

        resp.data.forEach((d) => {
          const observedat = new Date(
            d.year,
            d.month - 1,
            d.date,
            d.hour,
            d.minute
          );

          const humidity = {
            x: convertToLocalTime(observedat, { timeZone }),
            y: (d.reading as number) * 100,
          };
          humidities.push(humidity);
        });

        let color = "#00bbee";
        if (m.manufacturer === "OpenWeather") {
          color = "#005577";
        }

        this.chart.data.datasets.push({
          data: humidities,
          borderColor: color,
          fill: false,
        });

        this.chart.update();
      });
    });
  },
});

export default SystemHumidityChart;
</script>

<style scoped></style>
