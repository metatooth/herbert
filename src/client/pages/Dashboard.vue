<template>
  <div id="dashboard">
    <zones v-bind:units="units" />
    <units-selector v-bind:units="units" @change-units="changeUnits" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import UnitsSelector from "@/components/UnitsSelector.vue";
import Zones from "@/components/Zones.vue";

interface Notification {
  id: string;
  plug: string;
  action: string;
  code: string;
  message: string;
  timestamp: Date;
}

const Dashboard = Vue.extend({
  data() {
    return {
      notifications: [] as Notification[],
      units: "F"
    };
  },

  components: {
    UnitsSelector,
    Zones
  },

  mounted() {
    this.fetchData();

    console.log("Starting connection to WebSocket server...");

    const ws = new WebSocket(
      process.env.VUE_APP_WS_URL || "ws://localhost:5000"
    );

    ws.addEventListener("open", (ev: Event) => {
      console.log(ev);
      console.log("Connection open success!");
    });

    ws.addEventListener("message", (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      console.log("message with data", data);
      if (data.type === "STATUS") {
        console.log("Status report!");
      } else {
        console.log("Unhandled Message", data);
      }
    });
  },

  methods: {
    changeUnits(units: string) {
      this.units = units;
    },

    ...mapActions(["fetchData"]),

    deleteNotification(n: Notification): void {
      console.log("we are here", n);
      const found = this.notifications.findIndex(el => el.id === n.id);
      console.log("found!", found);
      this.notifications.splice(found, 1);
    }
  }
});

export default Dashboard;
</script>

<style>
#app {
  margin-top: 20px;
}
</style>
