<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import DeviceChart from "@/components/DeviceChart.vue";
import HumidityChart from "@/components/HumidityChart.vue";
import TemperatureChart from "@/components/TemperatureChart.vue";

const ZoneChart = Vue.extend({
  components: {
    DeviceChart,
    HumidityChart,
    TemperatureChart
  },
  props: {
    zone: Zone,
    units: string
  }
});

export default ZoneChart;
</script>

<template>
  <div class="columns">
    <div class="column">
      <temperature-chart :meters="zone.meters" />
    </div>
    <div class="column">
      <humidity-chart :meters="zone.meters" />
    </div>
    <div class="column">
      <device-chart :devices="zone.devices" />
    </div>
  </div>
</template>
