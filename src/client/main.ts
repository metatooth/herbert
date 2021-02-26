import "@/assets/main.scss";

import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Dashboard from "./components/Dashboard.vue";
import Readings from "./components/Readings.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faCheckCircle,
  faCloud,
  faMoon,
  faPencilAlt,
  faPlus,
  faPlusCircle,
  faSun,
  faThermometerHalf,
  faTimes,
  faTimesCircle,
  faTint,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheck);
library.add(faCheckCircle);
library.add(faCloud);
library.add(faMoon);
library.add(faPencilAlt);
library.add(faPlus);
library.add(faPlusCircle);
library.add(faSun);
library.add(faThermometerHalf);
library.add(faTimes);
library.add(faTimesCircle);
library.add(faTint);
library.add(faTrash);

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
