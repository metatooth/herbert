<script lang="ts">
import ConfigNarrow from "@client/components/ConfigNarrow.vue";
import DeviceNarrow from "@client/components/DeviceNarrow.vue";
import MeterNarrow from "@client/components/MeterNarrow.vue";
import ProfileNarrow from "@client/components/ProfileNarrow.vue";
import WorkerNarrow from "@client/components/WorkerNarrow.vue";
import ZoneNarrow from "@client/components/ZoneNarrow.vue";

import { Config } from "@client/store/configs/types";
import { Device } from "@client/store/devices/types";
import { Meter } from "@client/store/meters/types";
import { Profile } from "@client/store/profiles/types";
import { Worker } from "@client/store/workers/types";
import { Zone } from "@client/store/zones/types";

export default {
  components: {
    ConfigNarrow,
    DeviceNarrow,
    MeterNarrow,
    ProfileNarrow,
    WorkerNarrow,
    ZoneNarrow,
  },

  props: {
    items: { type: Array<object>, default: [] },
    type: String,
  },
};
</script>

<template>
  <div>
    <div v-if="type === 'config'">
      <config-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :config="item as Config"
      />
    </div>
    <div v-if="type === 'device'">
      <device-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :device="item as Device"
      />
    </div>
    <div v-if="type === 'meter'">
      <meter-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :meter="item as Meter"
      />
    </div>
    <div v-if="type === 'profile'">
      <profile-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :profile="item as Profile"
      />
    </div>
    <div v-if="type === 'worker'">
      <worker-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :worker="item as Worker"
      />
    </div>
    <div v-if="type === 'zone'">
      <zone-narrow
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :zone="item as Zone"
      />
    </div>
  </div>
</template>
