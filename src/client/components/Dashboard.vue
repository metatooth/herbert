<template>
  <div id="dashboard">
    <notifications
      v-bind:notifications="notifications"
      @delete-notification="deleteNotification"
    />
    <zones
      v-bind:zones="getterszones"
      v-bind:profiles="gettersprofiles"
      v-bind:units="units"
    />
    <zone-details
      v-bind:zones="getterszones"
      v-bind:profiles="gettersprofiles"
      v-bind:units="units"
    />
    <profiles v-bind:profiles="gettersprofiles" v-bind:units="units" />
    <devices v-bind:devices="gettersdevices" />
    <workers v-bind:workers="gettersworkers" />
    <units-selector v-bind:units="units" @change-units="changeUnits" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Devices from "@/components/Devices.vue";
import Notifications from "@/components/Notifications.vue";
import Profiles from "@/components/Profiles.vue";
import UnitsSelector from "@/components/UnitsSelector.vue";
import Workers from "@/components/Workers.vue";
import ZoneDetails from "@/components/ZoneDetails.vue";
import Zones from "@/components/Zones.vue";

interface Manufacturer {
  manufacturer: string;
  username: string;
  passwordDigest: string;
  timestamp: Date;
}

interface Device {
  device: string;
  deviceType: string;
  manufacturer: string;
  nickname: string;
  timestamp: Date;
}

interface Notification {
  id: string;
  plug: string;
  action: string;
  code: string;
  message: string;
  timestamp: Date;
}

interface Profile {
  id: number;
  profile: string;
  lampOnHour: number;
  lampOnMinute: number;
  lampDuration: number;
  lampOnTemperature: number;
  lampOnHumidity: number;
  lampOffTemperature: number;
  lampOffHumidity: number;
  timestamp: Date;
}

interface Reading {
  id: number;
  meter: string;
  temperature: number;
  humidity: number;
  pressure: number;
  timestamp: Date;
}

interface Worker {
  worker: string;
  nickname: string;
  timestamp: Date;
}

interface Zone {
  id: number;
  nickname: string;
  parent: string;
  profile: string;
  devices: number;
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
    Devices,
    Notifications,
    Profiles,
    UnitsSelector,
    Workers,
    ZoneDetails,
    Zones
  },

  computed: {
    getterszones() {
      return this.$store.getters.allZones;
    },
    zones() {
      return this.$store.state.zones;
    },
    gettersprofiles() {
      return this.$store.getters.allProfiles;
    },
    profiles() {
      return this.$store.state.profiles;
    },
    gettersdevices() {
      return this.$store.getters.allDevices;
    },
    devices() {
      return this.$store.state.devices;
    },
    gettersworkers() {
      return this.$store.getters.allWorkers;
    },
    workers() {
      return this.$store.state.workers;
    }
  },

  mounted() {
    console.log("Starting connection to WebSocket server...");

    const ws = new WebSocket(
      process.env.VUE_APP_WS_URL || "ws://localhost:5000"
    );

    ws.addEventListener("open", (ev: Event) => {
      this.onWebsocketOpen(ev);
    });

    ws.addEventListener("message", (ev: MessageEvent) => {
      this.onWebsocketMessage(ev);
    });

    this.$store.dispatch("getZones");
    this.$store.dispatch("getProfiles");
    this.$store.dispatch("getDevices");
    this.$store.dispatch("getWorkers");
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

    onWebsocketOpen(ev: Event): void {
      console.log(ev);
      console.log("Connection open success!");
    },

    onWebsocketMessage(ev: MessageEvent): void {
      const data = JSON.parse(ev.data);
      console.log("message with data", data);
      if (data.type === "STATUS") {
        console.log("Status report!");
      } else {
        console.log("Unhandled Message", data);
      }
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
