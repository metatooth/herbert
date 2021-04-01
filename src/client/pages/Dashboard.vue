<template>
  <div id="dashboard">
    <section class="section">
      <div class="tabs is-centered">
        <ul>
          <li :class="is('overview')" @click="pick('overview')">
            <a>Overview</a>
          </li>
          <li :class="is('devices')" @click="pick('devices')">
            <a>Devices</a>
          </li>
          <li :class="is('profiles')" @click="pick('profiles')">
            <a>Profiles</a>
          </li>
          <li :class="is('zones')" @click="pick('zones')">
            <a>Zones</a>
          </li>
          <li :class="is('workers')" @click="pick('workers')">
            <a>Herberts</a>
          </li>
          <li :class="is('settings')" @click="pick('settings')">
            <a>Settings</a>
          </li>
        </ul>
      </div>

      <overview v-if="is('overview')" @child-picked="pick" />
      <devices v-if="is('devices')" v-bind:units="units" />
      <profiles v-if="is('profiles')" v-bind:units="units" />
      <workers v-if="is('workers')" />
      <zones v-if="is('zones')" v-bind:units="units" />
      <div v-if="is('settings')">
        <units-selector v-bind:units="units" @change-units="changeUnits" />
      </div>
    </section>

    <section class="section">
      <nav class="level">
        <div class="level-left" />
        <div class="level-right">
          <p class="level-item">
            <em>
              <span class="lastupdate">Last update &#8212;</span>
              <timestamp v-bind:timestamp="ts" timezone="America/New_York" />
            </em>
          </p>
        </div>
      </nav>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Overview from "@/components/Overview.vue";
import UnitsSelector from "@/components/UnitsSelector.vue";
import Devices from "@/components/Devices.vue";
import Profiles from "@/components/Profiles.vue";
import Workers from "@/components/Workers.vue";
import Zones from "@/components/Zones.vue";
import Timestamp from "@/components/Timestamp.vue";
import { mapActions } from "vuex";

const Dashboard = Vue.extend({
  data() {
    return {
      picked: "overview",
      units: "F",
      ts: new Date()
    };
  },

  components: {
    Devices,
    Overview,
    Profiles,
    UnitsSelector,
    Timestamp,
    Workers,
    Zones
  },

  mounted() {
    this.refresh();
  },

  methods: {
    changeUnits(units: string) {
      this.units = units;
    },

    is(section: string) {
      if (this.picked === section) {
        return "is-active";
      }
      return "";
    },

    pick(section: string) {
      this.picked = section;
    },

    refresh() {
      this["devices/fetchData"]();
      this["profiles/fetchData"]();
      this["workers/fetchData"]();
      this["zones/fetchData"]();

      this.ts = new Date();

      setTimeout(this.refresh, 30000);
    },

    ...mapActions([
      "devices/fetchData",
      "profiles/fetchData",
      "workers/fetchData",
      "zones/fetchData"
    ])
  }
});

export default Dashboard;
</script>
