<template>
  <nav class="level">
    <div class="level-left" />
    <div class="level-right">
      <temperature-chart class="level-item" :meters="zone.meters" />
      <humidity-chart class="level-item" :meters="zone.meters" />
      <device-chart class="level-item" :devices="zone.devices" />
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Zone } from "@/store/zones/types";
import HTTP from "@/api/http";
import { convertToLocalTime } from "date-fns-timezone";
import ChartJS from "chart.js";
import "chartjs-adapter-date-fns";
import DeviceChart from "@/components/DeviceChart.vue";
import HumidityChart from "@/components/HumidityChart.vue";
import TemperatureChart from "@/components/TemperatureChart.vue";

const ZoneChart = Vue.extend({
  props: {
    zone: Zone,
    units: String
  },

components: {
DeviceChart,
HumidityChart,
TemperatureChart
},

  data() {
    return {
      chart: ChartJS
    };
  },

  computed: {
    id() {
      return `zone-chart-${this.zone.id}`;
    },

    ...mapGetters("settings", ["settings"])
  },

  mounted() {
    const datasets = [];
    const timeZone = this.settings.timezone;

    this.zone.meters.forEach(meter => {
      const temperatures = [];
      const humidities = [];

      HTTP.get(`/facts?meter=${meter.device}&units=CELSIUS`).then(resp => {
        resp.data.forEach(d => {
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
          temperatures.push(temperature);
        });
      });

      datasets.push({
        data: temperatures,
        borderColor: "#00bbee",
        fill: false
      });

      HTTP.get(`/facts?meter=${meter.device}&units=%RH`).then(resp => {
        resp.data.forEach(d => {
          const observedat = new Date(
            d.year,
            d.month - 1,
            d.date,
            d.hour,
            d.minute
          );
          const humidity = {
            x: convertToLocalTime(observedat, { timeZone }),
            y: d.reading as number
          };
          humidities.push(humidity);
        });
      });

      datasets.push({
        data: humidities,
        borderColor: "#ff7700",
        fill: false
      });
    });

    const ctx = document.getElementById(this.id);

    this.chart = new ChartJS(ctx, {
      type: "line",
      data: {
        datasets: this.datasets
      },
      options: {
        scales: {
          xAxes: [
            {
              display: true,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss"
              }
            }
          ],
          yAxes: [
            {
              display: true
            }
          ]
        }
      }
    });
  }
});

export default ZoneChart;
</script>

<style scoped></style>
