<template>
  <device-chart :devices="devices" />
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import DeviceChart from "@/components/DeviceChart.vue";

const SystemDeviceChart = Vue.extend({
  components: {
    DeviceChart,
  },

  computed: {
    ...mapGetters("devices", ["devices"]),
  },
});

export default SystemDeviceChart;
</script>

<style scoped></style>
