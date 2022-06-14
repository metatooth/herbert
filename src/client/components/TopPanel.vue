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
    <worker-camera v-for="worker in cameras" :key="worker.worker" :worker="worker" />
    <powered-by-herbert />
  </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import CurrentConditions from "@/components/CurrentConditions.vue";
import PoweredByHerbert from "@/components/PoweredByHerbert.vue";
import SystemDeviceChart from "@/components/SystemDeviceChart.vue";
import SystemHumidityChart from "@/components/SystemHumidityChart.vue";
import SystemTemperatureChart from "@/components/SystemTemperatureChart.vue";
import WorkerCamera from "@/components/WorkerCamera.vue";

const TopPanel = Vue.extend({

  components: {
    CurrentConditions,
    PoweredByHerbert,
    SystemDeviceChart,
    SystemHumidityChart,
    SystemTemperatureChart,
    WorkerCamera
  },

  computed: {
    cameras() {
      return this.workers.filter(worker => {
        return worker.camera !== null;
      });
    },
    
    ...mapGetters("workers", ["workers"]),
  }
});

export default TopPanel;
</script>

<style>
</style>
