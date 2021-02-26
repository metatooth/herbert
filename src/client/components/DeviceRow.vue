<template>
  <tr>
    <td>
      {{ device.device }}
    </td>
    <td>
      {{ device.nickname }}
    </td>
    <td>
      {{ device.deviceType }}
    </td>
    <td>
      {{ device.manufacturer }}
    </td>
    <td>
      <timestamp :timestamp="device.timestamp" />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";

import Timestamp from "@/components/Timestamp.vue";

const DeviceRow = Vue.extend({
  props: {
    device: Object
  },

  components: {
    Timestamp
  }
});

export default DeviceRow;
</script>
