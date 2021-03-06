<template>
  <section class="section">
    <h2 class="title">Zone Details</h2>
    <div class="columns">
      <zone-card
        v-for="zone in zones"
        v-bind:zone="zone"
        v-bind:key="zone.id"
        v-bind:units="units"
        v-bind:profiles="profiles"
        v-bind:devices="devices"
      />
    </div>
    <button class="button is-info">
      <font-awesome-icon icon="sync" @click="$store.dispatch('getZones')" />
    </button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ZoneCard from "@/components/ZoneCard.vue";

const ZoneConfigurations = Vue.extend({
  props: {
    zones: Array,
    profiles: Array,
    devices: Array,
    units: String
  },

  components: {
    ZoneCard
  }
});

export default ZoneConfigurations;
</script>
