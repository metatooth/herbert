import "@/assets/main.scss";

import Vue from "vue";

import router from "@/router";
import store from "@/store";
import App from "@/App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faCheckCircle,
  faCloud,
  faEdit,
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
library.add(faEdit);
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
