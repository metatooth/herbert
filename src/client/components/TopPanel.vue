<script lang="ts">
import { mapGetters } from "vuex";

import CurrentConditions from "@client/components/CurrentConditions.vue";
import PoweredByHerbert from "@client/components/PoweredByHerbert.vue";
import SystemDeviceChart from "@client/components/SystemDeviceChart.vue";
import SystemHumidityChart from "@client/components/SystemHumidityChart.vue";
import SystemTemperatureChart from "@client/components/SystemTemperatureChart.vue";
import WorkerCamera from "@client/components/WorkerCamera.vue";

export default {
  components: {
    CurrentConditions,
    PoweredByHerbert,
    SystemDeviceChart,
    SystemHumidityChart,
    SystemTemperatureChart,
    WorkerCamera,
  },

  computed: {
    cameras() {
      return this.workers.filter((worker) => {
        return worker.camera !== null;
      });
    },

    ...mapGetters("workers", ["workers"]),
  },
};
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="box">
        <system-temperature-chart />
      </div>
      <div class="box">
        <system-humidity-chart />
      </div>
      <div class="box">
        <system-device-chart />
      </div>
    </div>
    <div class="column">
      <current-conditions />
      <worker-camera
        v-for="worker in cameras"
        :key="worker.worker"
        :worker="worker"
      />
      <powered-by-herbert />
    </div>
  </div>
</template>
