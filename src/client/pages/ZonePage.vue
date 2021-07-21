<template>
  <div id="zone-page">
    <section class="section">
      <back-to-dashboard />
    </section>
    <section class="section">
      <zone-detail
        v-for="zone in zones"
        v-bind:key="zone.id"
        v-bind:zone="zone"
        v-bind:units="settings.units"
        />
    </section>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
import ZoneDetail from "@/components/ZoneDetail.vue";
import BackToDashboard from "@/components/BackToDashboard.vue";
import { mapGetters } from "vuex";

const ZonePage = Vue.extend({
  data() {
    return {
      selected: this.$route.params.id
    };
  },

  components: {
    BackToDashboard,
    ZoneDetail
  },

  computed: {
    ...mapGetters("settings", ["settings"]),
    ...mapGetters("zones", ["zones"])
  }
});

export default ZonePage;
</script>
