<script lang="ts">
import SystemDeviceChart from "@client/components/SystemDeviceChart.vue";
import SystemHumidityChart from "@client/components/SystemHumidityChart.vue";
import SystemTemperatureChart from "@client/components/SystemTemperatureChart.vue";

export default {
  components: {
    SystemDeviceChart,
    SystemHumidityChart,
    SystemTemperatureChart,
  },
};
</script>

<template>
  <nav class="level">
    <div class="level-left" />
    <div class="level-right">
      <div class="level-item">
        <system-temperature-chart class="box" />
      </div>
      <div class="level-item">
        <system-humidity-chart class="box" />
      </div>
      <div class="level-item">
        <system-device-chart class="box" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.level-item {
  width: 300px;
}

@media screen and (min-width: 769px) {
  .level-item {
    width: 200px;
  }
}

@media screen and (min-width: 1216px) {
  .level-item {
    width: 300px;
  }
}
</style>
