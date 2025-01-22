<script lang="ts">
import { mapGetters } from "vuex";

import ConfigRow from "@client/components/ConfigRow.vue";
import DeviceRow from "@client/components/DeviceRow.vue";
import MeterRow from "@client/components/MeterRow.vue";
import ProfileRow from "@client/components/ProfileRow.vue";
import WorkerRow from "@client/components/WorkerRow.vue";
import ZoneRow from "@client/components/ZoneRow.vue";

import { Config } from "@client/store/configs/types";
import { Device } from "@client/store/devices/types";
import { Meter } from "@client/store/meters/types";
import { Profile } from "@client/store/profiles/types";
import { Worker } from "@client/store/workers/types";
import { Zone } from "@client/store/zones/types";

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
    headings: { type: Array<string>, default: [] },
    items: { type: Array<object>, default: [] },
    locked: Boolean,
    type: String,
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
        :meter="item as Meter"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'device'">
      <device-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :device="item as Device"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'profile'">
      <profile-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :profile="item as Profile"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'zone'">
      <zone-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :zone="item as Zone"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'worker'">
      <worker-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :worker="item as Worker"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
    <tbody v-if="type === 'config'">
      <config-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :config="item as Config"
        :units="settings.units"
        :locked="locked"
      />
    </tbody>
  </table>
</template>
