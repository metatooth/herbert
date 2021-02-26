<template>
  <section class="section">
    <h2 class="subtitle">{{ zones.length }} {{ zonesName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Updated</th>
          <th>Profile</th>
        </tr>
      </thead>
      <tbody>
        <zone-row
          v-for="zone in zones"
          :key="zone.id"
          :units="units"
          v-bind:zone="zone"
        />
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ZoneRow from "@/components/ZoneRow.vue";

const Zones = Vue.extend({
  props: {
    zones: Array,
    units: String
  },

  components: {
    ZoneRow
  },

  computed: {
    zonesName(): string {
      if (this.zones.length === 1) {
        return "Zone";
      } else {
        return "Zones";
      }
    }
  }
});

export default Zones;
</script>
