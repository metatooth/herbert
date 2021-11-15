import "@/assets/main.scss";

import Vue from "vue";

import router from "@/router";
import store from "@/store";
import App from "@/App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCannabis,
  faCaretDown,
  faCaretUp,
  faCheck,
  faCheckCircle,
  faChevronCircleLeft,
  faCircle,
  faClock,
  faCloud,
  faCloudRain,
  faCog,
  faEdit,
  faFan,
  faFileCode,
  faFireAlt,
  faGripHorizontal,
  faGripVertical,
  faHistory,
  faLightbulb,
  faList,
  faMoon,
  faPencilAlt,
  faPlus,
  faPlusCircle,
  faPlug,
  faSearch,
  faSeedling,
  faSnowflake,
  faSun,
  faSync,
  faTachometerAlt,
  faThermometerHalf,
  faTimes,
  faTimesCircle,
  faTint,
  faTintSlash,
  faToggleOff,
  faToggleOn,
  faTrash,
  faUpload,
  faWind
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCannabis);
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faCheck);
library.add(faCheckCircle);
library.add(faChevronCircleLeft);
library.add(faCircle);
library.add(faClock);
library.add(faCloud);
library.add(faCloudRain);
library.add(faCog);
library.add(faEdit);
library.add(faFan);
library.add(faFileCode);
library.add(faFireAlt);
library.add(faGripHorizontal);
library.add(faGripVertical);
library.add(faHistory);
library.add(faLightbulb);
library.add(faList);
library.add(faMoon);
library.add(faPencilAlt);
library.add(faPlus);
library.add(faPlusCircle);
library.add(faPlug);
library.add(faSearch);
library.add(faSeedling);
library.add(faSnowflake);
library.add(faSun);
library.add(faSync);
library.add(faTachometerAlt);
library.add(faThermometerHalf);
library.add(faTimes);
library.add(faTimesCircle);
library.add(faTint);
library.add(faTintSlash);
library.add(faToggleOff);
library.add(faToggleOn);
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
