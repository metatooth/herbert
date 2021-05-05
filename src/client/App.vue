<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link
          :to="{ name: 'dashboard' }"
          class="navbar-item has-text-success is-size-3"
        >
          <font-awesome-icon icon="cannabis" v-if="!logo" />
          <img v-else :src="logo" width="48" height="48" />
        </router-link>
        <div class="navbar-item">
          <h1 class="title has-text-success">{{ title }}</h1>
        </div>
      </div>
    </nav>
    <router-view></router-view>
    <footer>
      <div class="content has-text-centered">
        <p>Powered by <img src="./assets/images/logo.png" /><br /></p>
      </div>
      <div class="copyright has-text-centered is-size-7">
        <p>
          {{ appVersion }} &#169;
          <a href="https://metatooth.com">Metatooth</a> 2021
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import appPackage from "../../package.json";

const App = Vue.extend({
  computed: {
    appVersion() {
      return appPackage["version"];
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

    ...mapGetters("settings", ["settings"])
  }
});
export default App;
</script>

<style scoped>
.container {
  margin: 20px;
}
.navbar-item img {
  max-height: 7rem;
}
.content {
  color: #00dd77;
}
.content p img {
  height: 1rem;
}
.copyright {
  color: #2d2d2d;
}
a {
  color: #2d2d2d;
}
</style>
