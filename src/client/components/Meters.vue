<template>
  <section class="section">
    <h2 class="title">{{ metersCount }} {{ metersName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Name</th>
          <th>Last Update</th>
          <th>History</th>
          <th>MAC</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <meter-row
          v-for="meter in meters"
          v-bind:key="meter.meter"
          v-bind:meter="meter"
          v-bind:units="units"
        />
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import MeterRow from "@/components/MeterRow.vue";
import { mapGetters } from "vuex";

const Meters = Vue.extend({
  props: {
    units: String
  },

  components: {
    MeterRow
  },

  computed: {
    ...mapGetters("devices", ["meters", "metersCount"]),

    metersName() {
      if (this.metersCount === 1) {
        return "Meter";
      } else {
        return "Meters";
      }
    }
  }
});

export default Meters;
</script>
