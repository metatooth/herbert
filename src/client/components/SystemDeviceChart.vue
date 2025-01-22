<script lang="ts">
import { mapGetters } from "vuex";

import DeviceChart from "@client/components/DeviceChart.vue";

export default {
  components: {
    DeviceChart,
  },

  computed: {
    ...mapGetters("devices", ["devices"]),
  },
};
</script>

<template>
  <device-chart :devices="devices" />
</template>
