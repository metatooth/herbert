import "@/assets/main.scss";

import Vue from "vue";

import router from "@/router";
import store from "@/store";
import App from "@/App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCannabis,
  faCheck,
  faCheckCircle,
  faCircle,
  faCloud,
  faEdit,
  faFan,
  faFireAlt,
  faLightbulb,
  faMoon,
  faPencilAlt,
  faPlus,
  faPlusCircle,
  faSnowflake,
  faSun,
  faSync,
  faTachometerAlt,
  faThermometerHalf,
  faTimes,
  faTimesCircle,
  faTint,
  faTintSlash,
  faTrash,
  faUpload,
  faWind
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCannabis);
library.add(faCheck);
library.add(faCheckCircle);
library.add(faCircle);
library.add(faCloud);
library.add(faEdit);
library.add(faFan);
library.add(faFireAlt);
library.add(faLightbulb);
library.add(faMoon);
library.add(faPencilAlt);
library.add(faPlus);
library.add(faPlusCircle);
library.add(faSnowflake);
library.add(faSun);
library.add(faSync);
library.add(faTachometerAlt);
library.add(faThermometerHalf);
library.add(faTimes);
library.add(faTimesCircle);
library.add(faTint);
library.add(faTintSlash);
library.add(faTrash);
library.add(faUpload);
library.add(faWind);

Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
