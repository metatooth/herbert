<template>
  <div>
    <router-view></router-view>
    <footer>
      <div class="copyright has-text-centered is-size-7">
        <p>
          {{ appVersion }} &#169;
          2022 <a href="https://metatooth.com">Metatooth LLC</a>
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
  color: #fdfdfd;
}
a {
  color: #fdfdfd;
}
</style>
