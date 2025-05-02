<script lang="ts">
import { mapGetters } from "vuex";

import TemperatureChart from "@client/components/TemperatureChart.vue";

export default {
  components: {
    TemperatureChart,
  },

  computed: {
    ...mapGetters("meters", ["meters"]),
  },
};
</script>

<template>
  <temperature-chart :meters="meters" />
</template>
