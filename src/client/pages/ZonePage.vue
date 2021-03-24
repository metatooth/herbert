<template>
  <section class="section">
    <zone-detail
      v-for="zstate in zones"
      v-bind:key="zstate.zone.id"
      v-bind:zone="zstate.zone"
      v-bind:units="units"
    />
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ZoneDetail from "@/components/ZoneDetail.vue";
import { mapGetters } from "vuex";

const ZonePage = Vue.extend({
  data() {
    return {
      selected: this.$route.params.id,
      units: this.$route.params.units
    };
  },

  components: {
    ZoneDetail
  },

  computed: {
    ...mapGetters("zones", ["zones"])
  }
});

export default ZonePage;
</script>
