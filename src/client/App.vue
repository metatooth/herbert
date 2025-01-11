<script lang="ts">
import Vue from "vue";
import appPackage from "../../package.json";

const App = Vue.extend({
  computed: {
    appVersion() {
      return appPackage["version"];
    },
  },
});
export default App;
</script>

<template>
  <div>
    <router-view />
    <footer>
      <a href="https://growherbert.com" class="content has-text-centered">
        <p>Powered by <img src="./assets/images/logo.png" /><br /></p>
      </a>
      <div class="copyright has-text-centered is-size-7">
        <p>
          {{ appVersion }} &#169; 2024
          <a href="https://metatooth.com">Metatooth</a>
        </p>
      </div>
    </footer>
  </div>
</template>

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
  color: #fdfdfd;
}
a {
  color: #fdfdfd;
}
</style>
