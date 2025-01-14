<script lang="ts">
import { mapGetters } from "vuex";

import ConfigRow from "@/components/ConfigRow.vue";
import DeviceRow from "@/components/DeviceRow.vue";
import MeterRow from "@/components/MeterRow.vue";
import ProfileRow from "@/components/ProfileRow.vue";
import WorkerRow from "@/components/WorkerRow.vue";
import ZoneRow from "@/components/ZoneRow.vue";

export default {
  components: {
    ConfigRow,
    DeviceRow,
    MeterRow,
    ProfileRow,
    WorkerRow,
    ZoneRow,
  },

  props: {
    headings: { type: Array<object>, default: [] },
    items: { type: Array<object>, default: [] },
    locked: boolean,
    type: string,
  },

  computed: {
    ...mapGetters("settings", ["settings"]),
  },
};
</script>

<template>
  <table class="table">
    <thead>
      <th v-for="(heading, index) in headings" :key="`heading-${index}`">
        {{ heading }}
      </th>
    </thead>
    <tbody v-if="type === 'meter'">
      <meter-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :meter="item"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'device'">
      <device-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :device="item"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'profile'">
      <profile-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :profile="item"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'zone'">
      <zone-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :zone="item"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'worker'">
      <worker-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :worker="item"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'config'">
      <config-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :config="item"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
  </table>
</template>
