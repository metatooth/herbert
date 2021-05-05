<template>
  <div id="dashboard">
    <section class="section">
      <div class="tabs is-centered">
        <ul>
          <li :class="is('overview')" @click="pick('overview')">
            <a>Overview</a>
          </li>
          <li :class="is('meters')" @click="pick('meters')">
            <a>Meters</a>
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
      <devices v-if="is('devices')" v-bind:units="settings.units" />
      <meters v-if="is('meters')" v-bind:units="settings.units" />
      <profiles v-if="is('profiles')" v-bind:units="settings.units" />
      <workers v-if="is('workers')" />
      <zones v-if="is('zones')" v-bind:units="settings.units" />
      <settings-page
        v-if="is('settings')"
        v-bind:settings="settings"
        @save-settings="saveSettings"
      />
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
import Devices from "@/components/Devices.vue";
import Meters from "@/components/Meters.vue";
import Profiles from "@/components/Profiles.vue";
import Workers from "@/components/Workers.vue";
import Zones from "@/components/Zones.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import Timestamp from "@/components/Timestamp.vue";
import { mapGetters, mapActions } from "vuex";

const Dashboard = Vue.extend({
  data() {
    return {
      picked: "overview",
      ts: new Date()
    };
  },

  components: {
    Devices,
    Overview,
    Meters,
    Profiles,
    Timestamp,
    Workers,
    Zones,
    SettingsPage
  },

  computed: {
    ...mapGetters("settings", ["settings"])
  },

  mounted() {
    this.refresh();
  },

  methods: {
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
      this["meters/fetchData"]();
      this["profiles/fetchData"]();
      this["workers/fetchData"]();
      this["zones/fetchData"]();
      this["settings/fetchData"]();

      this.ts = new Date();

      setTimeout(this.refresh, this.settings.refresh);
    },

    saveSettings(settings: string) {
      this["settings/edit"](JSON.parse(settings));
    },

    ...mapActions([
      "devices/fetchData",
      "meters/fetchData",
      "profiles/fetchData",
      "workers/fetchData",
      "zones/fetchData",
      "settings/fetchData",
      "settings/edit"
    ])
  }
});

export default Dashboard;
</script>
