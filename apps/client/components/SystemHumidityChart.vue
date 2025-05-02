<script lang="ts">
import { mapGetters } from "vuex";

import HumidityChart from "@client/components/HumidityChart.vue";

export default {
  components: {
    HumidityChart,
  },

  computed: {
    ...mapGetters("meters", ["meters"]),
  },
};
</script>

<template>
  <humidity-chart :meters="meters" />
</template>
