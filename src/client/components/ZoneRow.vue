<template>
  <tr>
    <td>
      <a :href="linkToConfig">{{ zone.nickname }}</a>
    </td>
    <td>
      <div v-if="zone.profile">
        {{ zone.profile }}
      </div>
      <div v-else>
        <a :href="linkToConfig">no profile set</a>
      </div>
    </td>
    <td>
      <div v-if="zone.parent">
        {{ zone.parent }}
      </div>
      <div v-else>
        <a :href="linkToConfig">no parent set</a>
      </div>
    </td>
    <td>
      <timestamp :timestamp="zone.timestamp" />
    </td>
    <td>
      <div class="field">
        <div class="control" v-if="canDelete">
          <button class="button" @click="destroy">
            <font-awesome-icon icon="trash" />
            <span>Delete</span>
          </button>
        </div>
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
    Timestamp
  },

  computed: {
    linkToConfig(): string {
      return "#" + this.zone.id + "config";
    },

    canDelete(): boolean {
      return false;  
    }
  }
});

export default ZoneRow;
</script>
