<template>
  <section class="section">
    <h2 class="subtitle">Zone Details</h2>
    <div class="tile is-ancestor">
      <zone-card
        v-for="zone in zones"
        v-bind:zone="zone"
        v-bind:key="zone.id"
        v-bind:units="units"
        v-bind:profiles="profiles"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ZoneCard from "@/components/ZoneCard.vue";

const ZoneConfigurations = Vue.extend({
  props: {
    zones: Array,
    profiles: Array,
    units: String
  },

  components: {
    ZoneCard
  }
});

export default ZoneConfigurations;
</script>
