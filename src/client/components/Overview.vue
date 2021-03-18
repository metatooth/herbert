<template>
  <div id="overview">
    <section class="info-tiles">
      <div class="tile is-ancestor has-text-centered">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ devicesCount }}</p>
            <p class="subtitle">Devices</p>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ profilesCount }}</p>
            <p class="subtitle">Profiles</p>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ zonesCount }}</p>
            <p class="subtitle">Zones</p>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ workersCount }}</p>
            <p class="subtitle">Herberts</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

const Overview = Vue.extend({
  computed: {
    ...mapGetters("devices", ["devicesCount"]),
    ...mapGetters("profiles", ["profilesCount"]),
    ...mapGetters("workers", ["workersCount"]),
    ...mapGetters("zones", ["zonesCount"])
  }
});
export default Overview;
</script>
