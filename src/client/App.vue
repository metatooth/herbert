<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link :to="{ name: 'dashboard' }" class="navbar-item">
          <img src="./assets/images/milltownag.png" />
        </router-link>
        <div class="navbar-item">
          <h1 class="title">Automation Control Ecosystem</h1>
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
import appPackage from "../../package.json";

const App = Vue.extend({
  data() {
    return {
      units: { type: String, default: "F" }
    };
  },

  computed: {
    appVersion() {
      return appPackage["version"];
    }
  },

  methods: {
    changeUnits(units) {
      this.units = units;
    }
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
