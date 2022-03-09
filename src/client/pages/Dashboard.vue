<template>
  <div class="container" id="dashboard">
    <herbert-navbar
      :active="picked"
      :locked="locked"
      @search-on="setFilter"
      @selected="selected"
      @toggle="toggle"
    />

    <nav class="level">
      <div class="level-left" />
      <div class="level-right">
        <div v-for="worker in workers" :key="worker.worker">
          <div class="level-item">
            <p class="subtitle">{{ worker.name }}</p>
          </div>
          <div class="level-item" v-if="worker.camera">
            <img :src="worker.camera" width="200" />
          </div>
          <div class="level-item">
            <p class="text">
              <em><readable :timestamp="worker.updatedat"/></em>
            </p>
          </div>
        </div>
        <current-conditions />
      </div>
    </nav>

    <div class="box">
      <collection
        v-if="is('devices')"
        type="device"
        :filter="filter"
        :locked="locked"
      />
      <collection
        v-if="is('meters')"
        type="meter"
        :filter="filter"
        :locked="locked"
      />
      <collection
        v-if="is('profiles')"
        type="profile"
        :filter="filter"
        :locked="locked"
      />
      <collection
        v-if="is('workers')"
        type="worker"
        :filter="filter"
        :locked="locked"
      />
      <collection
        v-if="is('configs')"
        type="config"
        :filter="filter"
        :locked="locked"
      />
      <collection
        v-if="is('zones') || is('overview')"
        type="zone"
        :filter="filter"
        :locked="locked"
      />
      <settings-page
        v-if="is('settings')"
        :settings="settings"
        @save-settings="saveSettings"
        :locked="locked"
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
import Readable from "@/components/Readable.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import Timestamp from "@/components/Timestamp.vue";

const Dashboard = Vue.extend({
  data() {
    return {
      filter: "",
      picked: "overview",
      locked: true,
      ts: new Date()
    };
  },

  components: {
    Collection,
    CurrentConditions,
    HerbertNavbar,
    Notifications,
    Readable,
    SettingsPage,
    Timestamp
  },

  computed: {
    ...mapGetters("settings", ["settings"]),
    ...mapGetters("workers", ["workers"])
  },

  mounted() {
    const locked = this.$cookies.get("locked");
    console.log("cookie locked", locked);
    if (locked) {
      this.locked = locked === "true";
    }
    console.log("this locked", this.locked);

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

    toggle() {
      console.log("lock", this.locked, this.settings.pin);
      if (!this.locked) {
        this.selected("overview");
        this.locked = true;
      } else if (this.settings.pin === "") {
        alert("Use Settings > PIN to set an access code.");
        this.locked = false;
      } else {
        const pin = prompt("Enter PIN to unlock.");
        if (pin === this.settings.pin) {
          this.locked = false;
        }
      }
      this.$cookies.set("locked", this.locked);
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
