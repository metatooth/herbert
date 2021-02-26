<template>
  <tr>
    <td>
      {{ worker.worker }}
    </td>
    <td>
      {{ worker.nickname }}
    </td>
    <td>
      <timestamp :timestamp="worker.timestamp" />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";

import Timestamp from "@/components/Timestamp.vue";

const WorkerRow = Vue.extend({
  props: {
    worker: Object
  },

  components: {
    Timestamp
  }
});

export default WorkerRow;
</script>
