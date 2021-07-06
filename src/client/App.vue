<template>
  <div>
    <router-view></router-view>
    <footer>
      <a
        href="https://github.com/metatooth/herbert"
        class="content has-text-centered"
      >
        <p>Powered by <img src="./assets/images/logo.png" /><br /></p>
      </a>
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
  computed: {
    appVersion() {
      return appPackage["version"];
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
