<script lang="ts">
import { mapGetters } from "vuex";

import ConfigTile from "@client/components/ConfigTile.vue";
import DeviceTile from "@client/components/DeviceTile.vue";
import MeterTile from "@client/components/MeterTile.vue";
import ProfileTile from "@client/components/ProfileTile.vue";
import WorkerTile from "@client/components/WorkerTile.vue";
import ZoneDetail from "@client/components/ZoneDetail.vue";
import ZoneTile from "@client/components/ZoneTile.vue";

import { Config } from "@client/store/configs/types";
import { Device } from "@client/store/devices/types";
import { Meter } from "@client/store/meters/types";
import { Profile } from "@client/store/profiles/types";
import { Worker } from "@client/store/workers/types";
import { Zone } from "@client/store/zones/types";

export default {
  components: {
    DeviceTile,
    MeterTile,
    ProfileTile,
    ZoneDetail,
    ZoneTile,
    WorkerTile,
    ConfigTile,
  },

  props: {
    locked: Boolean,
    left: { type: Array<object>, default: [] },
    middle: { type: Array<object>, default: [] },
    right: { type: Array<object>, default: [] },
    type: String,
  },

  computed: {
    ...mapGetters("settings", ["settings"]),
  },
};
</script>

<template>
  <div class="tile is-ancestor">
    <div v-if="type === 'meter'" class="tile is-4 is-vertical">
      <meter-tile
        v-for="(item, index) in left"
        :key="`item-${index}`"
        :meter="item as Meter"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'meter'" class="tile is-4 is-vertical">
      <meter-tile
        v-for="(item, index) in middle"
        :key="`item-${index}`"
        :meter="item as Meter"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'meter'" class="tile is-4 is-vertical">
      <meter-tile
        v-for="(item, index) in right"
        :key="`item-${index}`"
        :meter="item as Meter"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'device'" class="tile is-4 is-vertical">
      <device-tile
        v-for="(item, index) in left"
        :key="`item-${index}`"
        :device="item as Device"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'device'" class="tile is-4 is-vertical">
      <device-tile
        v-for="(item, index) in middle"
        :key="`item-${index}`"
        :device="item as Device"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'device'" class="tile is-4 is-vertical">
      <device-tile
        v-for="(item, index) in right"
        :key="`item-${index}`"
        :device="item as Device"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'profile'" class="tile is-4 is-vertical">
      <profile-tile
        v-for="(item, index) in left"
        :key="`item-${index}`"
        :profile="item as Profile"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'profile'" class="tile is-4 is-vertical">
      <profile-tile
        v-for="(item, index) in middle"
        :key="`item-${index}`"
        :profile="item as Profile"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'profile'" class="tile is-4 is-vertical">
      <profile-tile
        v-for="(item, index) in right"
        :key="`item-${index}`"
        :profile="item as Profile"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'zone'" class="tile is-4 is-vertical">
      <zone-tile
        v-for="(item, index) in left"
        :key="`item-${index}`"
        :zone="item as Zone"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'zone'" class="tile is-4 is-vertical">
      <zone-tile
        v-for="(item, index) in middle"
        :key="`item-${index}`"
        :zone="item as Zone"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'zone'" class="tile is-4 is-vertical">
      <zone-tile
        v-for="(item, index) in right"
        :key="`item-${index}`"
        :zone="item as Zone"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'zone-detail'" class="tile is-4 is-vertical">
      <zone-detail
        v-for="(item, index) in left"
        :key="`item-${index}`"
        :zone="item as Zone"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'zone-detail'" class="tile is-4 is-vertical">
      <zone-detail
        v-for="(item, index) in middle"
        :key="`item-${index}`"
        :zone="item as Zone"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'zone-detail'" class="tile is-4 is-vertical">
      <zone-detail
        v-for="(item, index) in right"
        :key="`item-${index}`"
        :zone="item as Zone"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'worker'" class="tile is-4 is-vertical">
      <worker-tile
        v-for="(item, index) in left"
        :key="`item-${index}`"
        :worker="item as Worker"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'worker'" class="tile is-4 is-vertical">
      <worker-tile
        v-for="(item, index) in middle"
        :key="`item-${index}`"
        :worker="item as Worker"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'worker'" class="tile is-4 is-vertical">
      <worker-tile
        v-for="(item, index) in right"
        :key="`item-${index}`"
        :worker="item as Worker"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'config'" class="tile is-4 is-vertical">
      <config-tile
        v-for="(item, index) in left"
        :key="`item-${index}`"
        :config="item as Config"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'config'" class="tile is-4 is-vertical">
      <config-tile
        v-for="(item, index) in middle"
        :key="`item-${index}`"
        :config="item as Config"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'config'" class="tile is-4 is-vertical">
      <config-tile
        v-for="(item, index) in right"
        :key="`item-${index}`"
        :config="item as Config"
        :units="settings.units"
        :locked="locked"
      />
    </div>
  </div>
</template>
