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
import Vue, { PropType } from "vue";

import Timestamp from "@/components/Timestamp.vue";

const WorkerRow = Vue.extend({
  props: {
    worker: { type: Object }
  },

  components: {
    Timestamp
  },

  mounted() {
    console.log("this guy", this.worker, this.nickname, this.timestamp);
  }

});

export default WorkerRow;
</script>
