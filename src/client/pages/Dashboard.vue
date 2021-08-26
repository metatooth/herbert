<template>
  <div id="dashboard">
    <nav id="navbar" class="herbert-navbar navbar">
      <div class="navbar-brand">
        <a
          class="navbar-item has-text-success is-size-3"
          @click="pick('overview')"
        >
          <font-awesome-icon icon="cannabis" v-if="!logo" class="icon" />
          <img v-else :src="logo" width="48" height="48" />
          {{ title }}
        </a>
        <button
          ref="searchIcon"
          class="navbar-item herbert-navbar-search-icon herbert-navbar-mobile-icon"
          @click.prevent="search"
        >
          <span class="icon">
            <font-awesome-icon icon="search" />
          </span>
        </button>
        <button
          ref="navbarBurger"
          class="navbar-burger"
          @click.prevent="burger"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div ref="navMenuIndex" class="navbar-menu">
        <div class="navbar-start herbert-navbar-start">
          <a
            class="navbar-item herbert-navbar-item"
            @click="pick('meters')"
            :class="is('meters')"
          >
            <span class="icon has-text-success">
              <font-awesome-icon icon="tachometer-alt" />
            </span>
            <span>Meters</span>
          </a>
          <a
            class="navbar-item herbert-navbar-item"
            @click="pick('devices')"
            :class="is('devices')"
          >
            <span class="icon has-text-success">
              <font-awesome-icon icon="plug" />
            </span>
            <span>Devices</span>
          </a>
          <a
            class="navbar-item herbert-navbar-item"
            @click="pick('profiles')"
            :class="is('profiles')"
          >
            <span class="icon has-text-success">
              <font-awesome-icon icon="seedling" />
            </span>
            <span>Profiles</span>
          </a>
          <a
            class="navbar-item herbert-navbar-item"
            @click="pick('zones')"
            :class="is('zones')"
          >
            <span class="icon has-text-success">
              <font-awesome-icon icon="grip-horizontal" />
            </span>
            <span>Zones</span>
          </a>
          <a
            class="navbar-item herbert-navbar-item"
            @click="pick('workers')"
            :class="is('workers')"
          >
            <span class="icon has-text-success">
              <img src="../assets/images/icon.png" class="herbert-icon" />
            </span>
            <span>Herberts</span>
          </a>
          <a
            class="navbar-item herbert-navbar-item"
            @click="pick('configs')"
            :class="is('configs')"
          >
            <span class="icon has-text-success">
              <font-awesome-icon icon="file-code" />
            </span>
            <span>Configs</span>
          </a>
          <a
            class="navbar-item herbert-navbar-item"
            @click="pick('settings')"
            :class="is('settings')"
          >
            <span class="icon has-text-success">
              <font-awesome-icon icon="cog" />
            </span>
            <span>Settings</span>
          </a>
        </div>
      </div>
      <div ref="search" class="herbert-search">
        <p class="control has-icons-left">
          <span
            class="autocomplete"
            style="position: relative; display: inline-block; direction: ltr;"
          >
            <input
              ref="herbertSearch"
              class="input is-rounded"
              placeHolder="Search ..."
              v-model="filter"
            />
          </span>
          <span class="icon is-small is-left">
            <font-awesome-icon icon="search" />
          </span>
        </p>
      </div>
    </nav>
    <section class="section">
      <overview v-if="is('overview')" @child-picked="pick" />
      <devices v-if="is('devices')" :filter="filter" />
      <meters v-if="is('meters')" :units="settings.units" />
      <profiles v-if="is('profiles')" :units="settings.units" />
      <workers v-if="is('workers')" />
      <configs v-if="is('configs')" />
      <zones v-if="is('zones')" :units="settings.units" />
      <settings-page
        v-if="is('settings')"
        :settings="settings"
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
import Configs from "@/components/Configs.vue";
import Zones from "@/components/Zones.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import Timestamp from "@/components/Timestamp.vue";
import { mapGetters, mapActions } from "vuex";

const Dashboard = Vue.extend({
  data() {
    return {
      filter: "",
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
    Configs,
    Zones,
    SettingsPage
  },

  computed: {
    logo() {
      if (this.settings.logo) {
        return this.settings.logo;
      }
      return null;
    },

    title() {
      return this.settings.title || "Grow More";
    },

    ...mapGetters("settings", ["settings"])
  },

  mounted() {
    this.refresh();
  },

  methods: {
    burger() {
      this.$refs.navbarBurger.classList.toggle("is-active");
      this.$refs.navMenuIndex.classList.toggle("is-active");
    },

    is(section: string) {
      if (this.picked === section) {
        return "is-active";
      }
      return "";
    },

    pick(section: string) {
      this.picked = section;
      if (this.picked !== "overview") {
        this.$refs.navbarBurger.classList.toggle("is-active");
        this.$refs.navMenuIndex.classList.toggle("is-active");
      }
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

    search() {
      this.$refs.search.classList.toggle("herbert-is-visible");

      if (this.$refs.search.classList.contains("herbert-is-visible")) {
        this.$refs.herbertSearch.focus();
      }
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
.herbert-navbar .navbar-start {
  flex-grow: 1;
}

.herbert-navbar .navbar-item,
.herbert-navbar .navbar-link {
  padding: 0.3em 0.75em;
}

.herbert-navbar .herbert-navbar-search-icon {
  justify-content: center;
  padding: 0;
  width: 3.25rem;
}

.herbert-navbar-search-icon {
  color: #00d1b2;
  cursor: pointer;
  margin-left: auto;
}

.herbert-navbar .navbar-burger {
  margin-left: 0;
}

.herbert-category-toggle,
.herbert-navbar-search-icon,
.herbert-tabs-nav button,
.navbar-burger {
  appereance: none;
  background: 0 0;
  border: none;
  font-size: 1em;
  margin: 0;
  padding: 0;
}

.navbar-burger {
  cursor: pointer;
  display: block;
  height: 3.25rem;
  width: 3.25rem;
  position: relative;
  margin-left: auto;
}

@media screen and (min-width: 769px) {
  .navbar-burger {
    display: none;
  }

  .herbert-navbar-mobile-icon {
    display: none;
  }
}

.herbert-search {
  width: 100%;
}

.herbert-search .autocomplete,
.herbert-search .control {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;
}

.herbert-search .control > .icon.is-left {
  color: #00d1b2 !important;
}

.herbert-search .input {
  background-color: #f5f5f5;
  border-color: transparent;
  box-shadow: none;
}

@media screen and (min-width: 1024px) {
  .herbert-search {
    align-items: center;
    display: flex;
    width: 16rem;
  }

  .herbert-navbar-search-icon {
    display: none;
  }
}

@media screen and (max-width: 1023px) {
  .herbert-search.herbert-is-visible {
    display: block;
  }

  .herbert-search {
    display: none;
    left: 0;
    padding: 1rem;
    right: 0;
    top: 3.25rem;
  }
}

.herbert-navbar-item > .icon {
  margin-left: -0.25rem;
  margin-right: 0.25rem;
}

.herbert-icon {
  height: 1rem;
  width: 1rem;
}
</style>
