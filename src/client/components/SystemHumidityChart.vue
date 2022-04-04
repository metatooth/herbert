<template>
  <humidity-chart :meters="meters" />
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import HumidityChart from "@/components/HumidityChart.vue";

const SystemHumidityChart = Vue.extend({
  components: {
    HumidityChart
  },
  
  computed: {
    ...mapGetters("meters", ["meters"])
  }

});

export default SystemHumidityChart;
</script>

<style scoped></style>
