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

<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import DeviceChart from "@/components/DeviceChart.vue";
import HumidityChart from "@/components/HumidityChart.vue";
import TemperatureChart from "@/components/TemperatureChart.vue";

const ZoneChart = Vue.extend({
  props: {
    zone: Zone,
    units: String,
  },

  components: {
    DeviceChart,
    HumidityChart,
    TemperatureChart,
  },
});

export default ZoneChart;
</script>
