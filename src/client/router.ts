import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "@/pages/Dashboard.vue";
import Readings from "@/pages/Readings.vue";
import Statuses from "@/pages/Statuses.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/readings/:meter", name: "readings", component: Readings },
  { path: "/statuses/:device", name: "statuses", component: Statuses }
];

const router = new VueRouter({
  routes: routes
});

router.replace("/dashboard");

export default router;
