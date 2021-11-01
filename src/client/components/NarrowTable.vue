<template>
  <div>
    <div v-if="type === 'config'">
      <config-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :config="item"
      />
    </div>
    <div v-if="type === 'device'">
      <device-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :device="item"
      />
    </div>
    <div v-if="type === 'meter'">
      <meter-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :meter="item"
      />
    </div>
    <div v-if="type === 'profile'">
      <profile-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :profile="item"
      />
    </div>
    <div v-if="type === 'worker'">
      <worker-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :worker="item"
      />
    </div>
    <div v-if="type === 'zone'">
      <zone-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :zone="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ConfigNarrow from "@/components/ConfigNarrow.vue";
import DeviceNarrow from "@/components/DeviceNarrow.vue";
import MeterNarrow from "@/components/MeterNarrow.vue";
import ProfileNarrow from "@/components/ProfileNarrow.vue";
import WorkerNarrow from "@/components/WorkerNarrow.vue";
import ZoneNarrow from "@/components/ZoneNarrow.vue";

const NarrowTable = Vue.extend({
  props: {
    items: [],
    type: String
  },

  components: {
    ConfigNarrow,
    DeviceNarrow,
    MeterNarrow,
    ProfileNarrow,
    WorkerNarrow,
    ZoneNarrow
  }
});

export default NarrowTable;
</script>
