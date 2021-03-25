import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "@/pages/Dashboard.vue";
import Readings from "@/pages/Readings.vue";
import Statuses from "@/pages/Statuses.vue";
import ZonePage from "@/pages/ZonePage.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/readings/:device", name: "readings", component: Readings },
  { path: "/statuses/:device", name: "statuses", component: Statuses },
  { path: "/zones", name: "zone", component: ZonePage }
];

const router = new VueRouter({
  routes: routes
});

router.replace("/dashboard");

export default router;
