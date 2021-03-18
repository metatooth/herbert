<template>
  <div id="dashboard">
    <div class="tabs is-centered">
      <ul>
        <li :class="is('devices')" @click="pick('devices')">
          <a>Devices</a>
        </li>
        <li :class="is('profiles')" @click="pick('profiles')">
          <a>Profiles</a>
        </li>
        <li :class="is('workers')" @click="pick('workers')">
          <a>Workers</a>
        </li>
        <li :class="is('zones')" @click="pick('zones')">
          <a>Zones</a>
        </li>
      </ul>
    </div>
    <devices v-if="is('devices')" />
    <profiles v-if="is('profiles')" v-bind:units="units" />
    <workers v-if="is('workers')" />
    <zones v-if="is('zones')" v-bind:units="units" />
    <units-selector v-bind:units="units" @change-units="changeUnits" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UnitsSelector from "@/components/UnitsSelector.vue";
import Devices from "@/components/Devices.vue";
import Profiles from "@/components/Profiles.vue";
import Workers from "@/components/Workers.vue";
import Zones from "@/components/Zones.vue";
import { mapActions } from "vuex";

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
      picked: "devices",
      units: "F"
    };
  },

  components: {
    Devices,
    Profiles,
    UnitsSelector,
    Workers,
    Zones
  },

  mounted() {
    this["devices/fetchData"]();
    this["profiles/fetchData"]();
    this["workers/fetchData"]();
    this["zones/fetchData"]();

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
    deleteNotification(n: Notification): void {
      console.log("we are here", n);
      const found = this.notifications.findIndex(el => el.id === n.id);
      console.log("found!", found);
      this.notifications.splice(found, 1);
    },
    is(section: string) {
      console.log("is?", this.picked, section);
      if (this.picked === section) {
        return "is-active";
      }
      return "";
    },
    pick(section: string) {
      console.log("pick", section);
      this.picked = section;
    },
    ...mapActions([
      "devices/fetchData",
      "profiles/fetchData",
      "workers/fetchData",
      "zones/fetchData"
    ])
  }
});

export default Dashboard;
</script>

<style>
#app {
  margin-top: 20px;
}
</style>
