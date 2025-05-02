import { createWebHistory, createRouter } from "vue-router";

import Dashboard from "@client/pages/Dashboard.vue";
import Readings from "@client/pages/Readings.vue";
import Statuses from "@client/pages/Statuses.vue";
import ZonePage from "@client/pages/ZonePage.vue";

const routes = [
  { path: "/", name: "dashboard", component: Dashboard },
  { path: "/readings/:device", name: "readings", component: Readings },
  { path: "/statuses/:device", name: "statuses", component: Statuses },
  { path: "/zones/:id", name: "zone", component: ZonePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
