import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "@/components/Dashboard.vue";
import Readings from "@/components/Readings.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/readings/:meter", name: "readings", component: Readings }
];

const router = new VueRouter({
  routes: routes
});

router.replace("/dashboard");

export default router;
