import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "@/components/Dashboard.vue";
import Readings from "@/components/Readings.vue";
import Statuses from "@/components/Statuses.vue";

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
