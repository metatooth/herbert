<template>
  <tr>
    <td>
      <a :href="linkToConfig">{{ zone.nickname }}</a>
    </td>
    <td>
      <timestamp :timestamp="zone.timestamp" />
    </td>
    <td>
      <div v-if=zone.profile>       
        {{ zone.profile }}
      </div>
      <div v-else>
        <a :href="linkToConfig">no profile set</a>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";

import Timestamp from "@/components/Timestamp.vue";

const ZoneRow = Vue.extend({
  props: {
    zone: { type: Object }
  },

  components: {
    Timestamp,
  },

  computed: {
    linkToConfig(): string {
      return "#" + this.zone.id + "config";
    }
  }
});

export default ZoneRow;
</script>
