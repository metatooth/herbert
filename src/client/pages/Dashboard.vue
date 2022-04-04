<template>
  <div class="container" id="dashboard">
    <herbert-navbar
      class="box"
      :active="picked"
      :locked="locked"
      @search-on="setFilter"
      @selected="selected"
      @toggle="toggle"
    />

    <nav v-if="is('overview')" class="level box">
      <div class="level-left" />
      <current-conditions width="300px" />

      <div class="level-right" v-for="worker in cameras" :key="worker.worker">
        <div class="level-item">
          <p class="subtitle">{{ worker.name }}</p>
        </div>
        <div class="level-item">
          <img :src="worker.camera" width="300px" height="225px" />
        </div>
      </div>
    </nav>

    <div v-if="is('overview')" class="box">
      <system-chart />
    </div>

    <div v-else class="box">
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
        v-if="is('zones')"
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

    <timestamp class="box" :timestamp="ts" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";

import Collection from "@/components/Collection.vue";
import CurrentConditions from "@/components/CurrentConditions.vue";
import HerbertNavbar from "@/components/HerbertNavbar.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import Timestamp from "@/components/Timestamp.vue";
import SystemChart from "@/components/SystemChart.vue";

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
    SettingsPage,
    SystemChart,
    Timestamp
  },

  computed: {
    cameras() {
      return this.workers.filter(worker => {
        return worker.camera !== null;
      });
    },

    logo() {
      if (this.settings.logo) {
        return this.settings.logo;
      }
      return null;
    },

    ...mapGetters("settings", ["settings"]),
    ...mapGetters("workers", ["workers"]),
    ...mapGetters("zones", ["zones"])
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

<style scoped>
.herbert-worker {
  width: 300px;
}
</style>
