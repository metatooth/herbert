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

    <top-panel v-if="is('overview')" />
    
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
import HerbertNavbar from "@/components/HerbertNavbar.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import Timestamp from "@/components/Timestamp.vue";
import TopPanel from "@/components/TopPanel.vue";

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
    HerbertNavbar,
    SettingsPage,
    TopPanel,
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

<style>
 
.herbert-worker {
  width: 300px;
}

.card-content {
color: #00dd77;
align: center;
}

.card-image .logo {
height: 2rem;
}

.card-footer {
  border-top: 0px;
}

a, .card-header-title {
  color: #00dd77;
}

</style>
