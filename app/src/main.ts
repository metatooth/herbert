require("@/assets/main.scss");

import Vue from "vue";
import App from "./App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTint,
  faThermometerHalf,
  faCloud
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import ClientCard from "./components/ClientCard.vue";
import Notification from "./components/Notification.vue";

library.add(faTint);
library.add(faThermometerHalf);
library.add(faCloud);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("client-card", ClientCard);
Vue.component("notification", Notification);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
