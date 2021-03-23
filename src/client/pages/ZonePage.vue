<template>
  <section class="section">
    <zone-detail
      v-for="zone in zones"
      v-bind:key="zone.id"
      v-bind:zone="zone"
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
    }
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
