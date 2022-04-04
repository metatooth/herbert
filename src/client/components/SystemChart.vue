<template>
  <nav class="level">
    <div class="level-left" />
    <div class="level-right">
      <system-temperature-chart class="level-item" />
      <system-humidity-chart class="level-item" />
      <system-device-chart class="level-item" />
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import SystemDeviceChart from "@/components/SystemDeviceChart.vue";
import SystemHumidityChart from "@/components/SystemHumidityChart.vue";
import SystemTemperatureChart from "@/components/SystemTemperatureChart.vue";

const SystemChart = Vue.extend({
  components: {
    SystemDeviceChart,
    SystemHumidityChart,
    SystemTemperatureChart
  }
});

export default SystemChart;
</script>

<style scoped>
.level-item {
  width: 400px;
}

@media screen and (min-width: 769px) {
  .level-item {
    width: 300px;
  }
}

@media screen and (min-width: 1216px) {
  .level-item {
    width: 400px;
  }
}
</style>
