import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "@/pages/Dashboard.vue";
import Readings from "@/pages/Readings.vue";
import Statuses from "@/pages/Statuses.vue";
import ZoneDetail from "@/pages/ZoneDetail.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/readings/:device", name: "readings", component: Readings },
  { path: "/statuses/:device", name: "statuses", component: Statuses },
  { path: "/zones/:id", name: "zone", component: ZoneDetail }
];

const router = new VueRouter({
  routes: routes
});

router.replace("/dashboard");

export default router;
