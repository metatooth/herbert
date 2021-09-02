<template>
  <section class="section">
    <div class="level">
      <span class="title">{{ activeCount }} {{ metersName }}</span>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical">
        <meter-tile v-for="meter in left" :key="meter.id" :meter="meter" />
      </div>
      <div class="tile is-4 is-vertical">
        <meter-tile v-for="meter in middle" :key="meter.id" :meter="meter" />
      </div>
      <div class="tile is-4 is-vertical">
        <meter-tile v-for="meter in right" :key="meter.id" :meter="meter" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import MeterTile from "@/components/MeterTile.vue";
import { mapGetters } from "vuex";

const Meters = Vue.extend({
  props: {
    filter: String,
    units: String
  },

  components: {
    MeterTile
  },

  computed: {
    ...mapGetters("meters", ["meters"]),

    activeSet() {
      return this.meters.filter(el => {
        if (el.nickname) {
          if (el.nickname.match(this.filter)) {
            return true;
          }
        }

        return el.device.match(this.filter);
      });
    },

    activeCount() {
      return this.activeSet.length;
    },

    metersName() {
      if (this.activeCount === 1) {
        return "Meter";
      } else {
        return "Meters";
      }
    },

    left() {
      const meters = [];
      for (let i = 0; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          meters.push(this.activeSet[i]);
        }
      }
      return meters;
    },

    middle() {
      const meters = [];
      for (let i = 1; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          meters.push(this.activeSet[i]);
        }
      }
      return meters;
    },

    right() {
      const meters = [];
      for (let i = 2; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          meters.push(this.activeSet[i]);
        }
      }
      return meters;
    }
  }
});
export default Meters;
</script>
