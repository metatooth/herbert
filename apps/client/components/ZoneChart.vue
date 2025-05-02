<script lang="ts">
import { Zone } from "@client/store/zones/types";
import DeviceChart from "@client/components/DeviceChart.vue";
import HumidityChart from "@client/components/HumidityChart.vue";
import TemperatureChart from "@client/components/TemperatureChart.vue";

export default {
  components: {
    DeviceChart,
    HumidityChart,
    TemperatureChart,
  },
  props: {
    zone: Zone,
  },
};
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
