import "@/assets/main.scss";

import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Dashboard from "./components/Dashboard.vue";
import Readings from "./components/Readings.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle,
  faCloud,
  faMoon,
  faPencilAlt,
  faSun,
  faThermometerHalf,
  faTimesCircle,
  faTint
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheckCircle);
library.add(faCloud);
library.add(faMoon);
library.add(faPencilAlt);
library.add(faSun);
library.add(faThermometerHalf);
library.add(faTimesCircle);
library.add(faTint);

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
