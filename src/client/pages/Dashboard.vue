<template>
  <div class="container" id="dashboard">
    <herbert-navbar
      :active="picked"
      @search-on="setFilter"
      @selected="selected"
    />

    <current-conditions />

    <div class="box">
      <collection v-if="is('devices')" type="device" :filter="filter" />
      <collection v-if="is('meters')" type="meter" :filter="filter" />
      <collection v-if="is('profiles')" type="profile" :filter="filter" />
      <collection v-if="is('workers')" type="worker" :filter="filter" />
      <collection v-if="is('configs')" type="config" :filter="filter" />
      <collection
        v-if="is('zones') || is('overview')"
        type="zone"
        :filter="filter"
      />
      <settings-page
        v-if="is('settings')"
        :settings="settings"
        @save-settings="saveSettings"
      />
    </div>

    <notifications class="box" v-if="is('overview')" />

    <timestamp class="box" :timestamp="ts" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";

import Collection from "@/components/Collection.vue";
import CurrentConditions from "@/components/CurrentConditions.vue";
import HerbertNavbar from "@/components/HerbertNavbar.vue";
import Notifications from "@/components/Notifications.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import Timestamp from "@/components/Timestamp.vue";

const Dashboard = Vue.extend({
  data() {
    return {
      filter: "",
      picked: "overview",
      ts: new Date()
    };
  },

  components: {
    Collection,
    CurrentConditions,
    HerbertNavbar,
    Notifications,
    SettingsPage,
    Timestamp
  },

  computed: {
    ...mapGetters("settings", ["settings"])
  },

  mounted() {
    this.refresh();
  },

  methods: {
    is(section: string) {
      return this.picked === section;
    },

    refresh() {
      this["devices/fetchData"]();
      this["meters/fetchData"]();
      this["profiles/fetchData"]();
      this["workers/fetchData"]();
      this["configs/fetchData"]();
      this["zones/fetchData"]();
      this["settings/fetchData"]();

      this.ts = new Date();

      setTimeout(this.refresh, this.settings.refresh);
    },

    saveSettings(settings: string) {
      this["settings/edit"](JSON.parse(settings));
    },

    selected(val: string) {
      this.picked = val;
    },

    setFilter(val: string) {
      this.filter = val;
    },

    ...mapActions([
      "devices/fetchData",
      "meters/fetchData",
      "profiles/fetchData",
      "workers/fetchData",
      "configs/fetchData",
      "zones/fetchData",
      "settings/fetchData",
      "settings/edit"
    ])
  }
});

export default Dashboard;
</script>
