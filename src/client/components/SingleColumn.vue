<template>
  <div class="tile is-ancestor">
    <div class="tile is-4 is-vertical" v-if="type === 'device'">
      <device-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :device="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div class="tile is-4 is-vertical" v-if="type === 'meter'">
      <meter-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :meter="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div class="tile is-4 is-vertical" v-if="type === 'profile'">
      <profile-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :profile="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div class="tile is-4 is-vertical" v-if="type === 'zone'">
      <zone-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :zone="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div class="tile is-4 is-vertical" v-if="type === 'zone-detail'">
      <zone-detail
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :zone="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div class="tile is-4 is-vertical" v-if="type === 'worker'">
      <worker-tile
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :worker="item"
        :units="settings.units"
        :locked="locked"
      />
    </div>
    <div class="tile is-4 is-vertical" v-if="type === 'config'">
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
  props: {
    items: [],
    locked: Boolean,
    type: String
  },

  components: {
    DeviceTile,
    MeterTile,
    ProfileTile,
    ZoneDetail,
    ZoneTile,
    WorkerTile,
    ConfigTile
  },

  computed: {
    ...mapGetters("settings", ["settings"])
  }
});

export default SingleColumn;
</script>
