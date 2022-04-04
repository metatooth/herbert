<template>
  <temperature-chart :meters="meters" />
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import TemperatureChart from "@/components/TemperatureChart.vue";

const SystemTemperatureChart = Vue.extend({
  components: {
    TemperatureChart
  },
  
  computed: {
    ...mapGetters("meters", ["meters"])
  }

});

export default SystemTemperatureChart;
</script>

<style scoped></style>
