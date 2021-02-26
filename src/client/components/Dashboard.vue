<template>
  <div id="dashboard">
    <notifications
      v-bind:notifications="notifications"
      @delete-notification="deleteNotification"
    />
    <zones v-bind:zones="zones" :units="units" />
    <zone-configurations
      v-bind:zones="zones"
      v-bind:profiles="profiles"
      :units="units"
      @update-zone="updateZone"
    />
    <profiles v-bind:profiles="profiles" :units="units" />
    <devices v-bind:devices="devices" />
    <workers v-bind:workers="workers" />
    <units-selector :units="units" @change-units="changeUnits" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Devices from "@/components/Devices.vue";
import Notifications from "@/components/Notifications.vue";
import Profiles from "@/components/Profiles.vue";
import UnitsSelector from "@/components/UnitsSelector.vue";
import Workers from "@/components/Workers.vue";
import ZoneConfigurations from "@/components/ZoneConfigurations.vue";
import Zones from "@/components/Zones.vue";
import { Device, 
Notification, 
Profile, 
Worker, 
Zone } from "../../shared/@types/main";

const Dashboard = Vue.extend({
  data() {
    return {
      devices: [] as Device[],
      zones: [] as Zone[],
      notifications: [] as Notification[],
      profiles: [] as Profile[],
      workers: [] as Worker[],
      xhr: XMLHttpRequest,
      url: String,
      units: "F"
    };
  },

  components: {
    Devices,
    Notifications,
    Profiles, 
    UnitsSelector,
    Workers,
    ZoneConfigurations,
    Zones
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

    this.url = process.env.VUE_APP_API_URL || "http://localhost:5000";

    this.refreshZones();
    this.refreshProfiles();
    this.refreshDevices();
    this.refreshWorkers();
  },

  computed: {
    clientsName(): string {
      if (this.clients.length === 1) {
        return "client";
      } else {
        return "clients";
      }
    }
  },

  methods: {
    changeUnits(units: string) {
      this.units = units;
    },

    deleteNotification(n: any): void {
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
        console.log("do something!");
      } else {
        console.log("Unhandled Message", data);
      }
    },

    refreshDevices() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${this.url}/devices`);

      xhr.onload = () => {
        console.log("onload", xhr.response);
        const data = JSON.parse(xhr.response);
        this.devices = [];
        data.forEach((d: any) => { 
          console.log("device", d);
          this.devices.push(d);
          console.log(this.devices.length);
        });
      };

      xhr.send();
    },

    refreshZones() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${this.url}/zones`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        this.zones = [];

        data.forEach((d: any) => {
          const z: Zone = {
            id: d.id,
            nickname: d.nickname,
            profile: d.profile,
            timestamp: d.created_at
          };
          this.zones.push(z);
        });
      };

      xhr.send();
    },

    refreshProfiles() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${this.url}/profiles`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        this.profiles = [];
        data.forEach((d: any) => {
          const start = d.lamp_start.split(":");

          const pd: Profile = {
            id: parseInt(d.id),
            profile: d.profile,
            lampOnHour: start[0],
            lampOnMinute: start[1],
            lampDuration: parseInt(d.lamp_duration["hours"]),
            lampOnTemperature: parseFloat(d.lamp_on_temperature),
            lampOnHumidity: parseFloat(d.lamp_on_humidity),
            lampOffTemperature: parseFloat(d.lamp_off_temperature),
            lampOffHumidity: parseFloat(d.lamp_off_humidity),
            timestamp: new Date(d.updated_at)
          };

          this.profiles.push(pd);
        });
      };

      xhr.send();
    },

    refreshWorkers() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${this.url}/workers`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        this.workers = [];
        data.forEach((d: any) => { 
          console.log("worker", d);
          const w: Worker = {
            worker: d.worker,
            nickname: d.nickname,
            timestamp: d.updated_at
          };
          this.workers.push(w);

console.log("length", this.workers.length);
        });
      };

      xhr.send();
    },

    updateZone(z: any) {
      console.log("UPDATE ZONE", z);
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
