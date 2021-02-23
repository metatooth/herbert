import "@/assets/main.scss";

import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Dashboard from "./components/Dashboard.vue";
import Readings from "./components/Readings.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTint,
  faThermometerHalf,
  faCloud,
  faSun,
  faMoon
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTint);
library.add(faThermometerHalf);
library.add(faCloud);
library.add(faSun);
library.add(faMoon);

Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/readings/:meter", name: "readings", component: Readings }
];

const router = new VueRouter({
  routes: routes
});
router.replace("/dashboard");

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
