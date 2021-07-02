<template>
  <section class="section">
    <zone-detail
      v-for="zone in zones"
      v-bind:key="zone.id"
      v-bind:zone="zone"
      v-bind:units="settings.units"
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
      selected: this.$route.params.id
    };
  },

  components: {
    ZoneDetail
  },

  computed: {
    ...mapGetters("settings", ["settings"]),
    ...mapGetters("zones", ["zones"])
  }
});

export default ZonePage;
</script>
