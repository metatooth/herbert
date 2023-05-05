import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import MeterReadings from "@/pages/MeterReadings.vue";
import DeviceStatuses from "@/pages/DeviceStatuses.vue";
import ZonePage from "@/pages/ZonePage.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/dashboard", name: "dashboard", component: HomePage },
  { path: "/readings/:device", name: "readings", component: MeterReadings },
  { path: "/statuses/:device", name: "statuses", component: DeviceStatuses },
  { path: "/zones/:id", name: "zone", component: ZonePage },
];

const router = new VueRouter({
  routes: routes,
});

router.replace("/dashboard");

export default router;
