<template>
  <nav id="navbar" class="herbert-navbar navbar">
    <div class="navbar-brand">
      <a class="navbar-item" @click="pick('overview')">
        <span class="herbert-logo">
          <font-awesome-icon icon="seedling" v-if="!logo" class="icon" />
          <img v-else :src="logo" width="48" height="48" />
        </span>
        <span class="herbert-title">{{ title }}</span>
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
      <a ref="navbarBurger" class="navbar-burger" @click.prevent="burger">
        <span></span>
        <span></span>
        <span></span>
      </a>
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
            <font-awesome-icon icon="cannabis" />
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
          v-if="!locked"
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
          v-if="!locked"
        >
          <span class="icon has-text-success">
            <font-awesome-icon icon="cog" />
          </span>
          <span>Settings</span>
        </a>
        <button
          ref="lockIcon"
          class="navbar-item herbert-navbar-lock-icon"
          @click.prevent="toggle"
        >
          <span class="icon">
            <font-awesome-icon :icon="lockIcon" />
          </span>
        </button>
      </div>
    </div>
    <div ref="search" class="herbert-search">
      <p class="control has-icons-left">
        <span
          class="herbert-autocomplete"
          style="position: relative; display: inline-block; direction: ltr"
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
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

const HerbertNavbar = Vue.extend({
  props: {
    locked: { type: Boolean, default: true },
  },

  data() {
    return {
      filter: "",
    };
  },

  computed: {
    lockIcon() {
      return this.locked ? "lock" : "lock-open";
    },

    logo() {
      if (this.settings.logo) {
        return this.settings.logo;
      }
      return null;
    },

    title() {
      return this.settings.title || "Grow More";
    },

    ...mapGetters("settings", ["settings"]),
  },

  watch: {
    filter(val: string) {
      this.$emit("search-on", val);
    },
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
      this.filter = "";
      this.$emit("selected", section);
      if (this.picked !== "overview") {
        this.$refs.navbarBurger.classList.toggle("is-active");
        this.$refs.navMenuIndex.classList.toggle("is-active");
      }
    },

    search() {
      this.$refs.search.classList.toggle("herbert-is-visible");

      if (this.$refs.search.classList.contains("herbert-is-visible")) {
        this.$refs.herbertSearch.focus();
      }
    },

    toggle() {
      this.$emit("toggle");
    },
  },
});

export default HerbertNavbar;
</script>

<style scoped>
.herbert-navbar .navbar-start {
  flex-grow: 1;
}

.herbert-logo {
  color: #00d1b2;
}

.herbert-title {
  color: #00d1b2;
  margin-left: 10px;
}

.herbert-navbar .navbar-brand img {
  height: 28px;
  max-height: 2em;
  width: 112px;
}

.herbert-navbar .herbert-navbar-search-icon {
  justify-content: center;
  padding: 0;
  width: 3.25rem;
}

.herbert-navbar .herbert-navbar-lock-icon {
  justify-content: center;
  padding: 0;
  width: 3.25rem;
}

.herbert-navbar .navbar-burger {
  margin-left: 0;
}

.herbert-navbar-lock-icon,
.herbert-navbar-search-icon,
.navbar-burger {
  appearance: none;
  background: 0 0;
  border: none;
  font-family: inherit;
  font-size: 1em;
  margin: 0;
}

.herbert-navbar-search-icon {
  color: #00d1b2;
  cursor: pointer;
  margin-left: auto;
}

.herbert-navbar-lock-icon {
  color: #00d1b2;
  cursor: pointer;
  margin-left: auto;
}

.herbert-search {
  width: 100%;
}

.herbert-search .input {
  background-color: #f5f5f5;
  border-color: transparent;
  box-shadow: none;
}

.herbert-search .herbert-autocomplete,
.herbert-search .control {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;
}

.herbert-search .control > .icon.is-left {
  color: #00d1b2 !important;
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
</style>
