<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import DeviceTile from "@/components/DeviceTile.vue";
import MeterTile from "@/components/MeterTile.vue";
import ProfileTile from "@/components/ProfileTile.vue";
import ZoneDetail from "@/components/ZoneDetail.vue";
import ZoneTile from "@/components/ZoneTile.vue";
import WorkerTile from "@/components/WorkerTile.vue";
import ConfigTile from "@/components/ConfigTile.vue";

const SingleColumn = Vue.extend({
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
    items: { type: Array<object>, default: [] },
    locked: Boolean,
    type: string,
  },

  computed: {
    ...mapGetters("settings", ["settings"]),
  },
});

export default SingleColumn;
</script>

<template>
  <div class="tile is-ancestor">
    <div v-if="type === 'device'" class="tile is-4 is-vertical">
      <device-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :device="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'meter'" class="tile is-4 is-vertical">
      <meter-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :meter="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'profile'" class="tile is-4 is-vertical">
      <profile-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :profile="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'zone'" class="tile is-4 is-vertical">
      <zone-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :zone="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'zone-detail'" class="tile is-4 is-vertical">
      <zone-detail
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :zone="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'worker'" class="tile is-4 is-vertical">
      <worker-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :worker="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div v-if="type === 'config'" class="tile is-4 is-vertical">
      <config-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :config="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
  </div>
</template>
