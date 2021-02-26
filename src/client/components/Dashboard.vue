<template>
  <div id="dashboard">
    <notifications
      v-bind:notifications="notifications"
      @delete-notification="deleteNotification"
    />
    <zones
      v-bind:zones="zones"
      v-bind:profiles="profiles"
      v-bind:units="units"
      @create-zone="createZone"
    />
    <zone-details
      v-bind:zones="zones"
      v-bind:profiles="profiles"
      v-bind:units="units"
      @update-zone="updateZone"
    />
    <profiles v-bind:profiles="profiles" v-bind:units="units" />
    <devices v-bind:devices="devices" />
    <workers v-bind:workers="workers" />
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
  lampStart: number;
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
  devices: []
  timestamp: Date;
}

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
    ZoneDetails,
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

    this.readZones();
    this.readProfiles();
    this.readDevices();
    this.readWorkers();
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
        console.log("do something!");
      } else {
        console.log("Unhandled Message", data);
      }
    },

    readDevices() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${this.url}/devices`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        this.devices = [];
        data.forEach((device: Device) => {
          device.timestamp = new Date(Date.parse(device.updated_at));
          this.devices.push(device);
        });
      };

      xhr.send();
    },

    readProfiles() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${this.url}/profiles`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        this.profiles = [];
        data.forEach((profile: Profile) => {
          profile.timestamp = new Date(Date.parse(profile.updated_at));
          this.profiles.push(profile);
        });
      };

      xhr.send();
    },

    readWorkers() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${this.url}/workers`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        this.workers = [];
        data.forEach((worker: Worker) => {
          worker.timestamp = new Date(Date.parse(worker.updated_at));
          this.workers.push(worker);
        });
      };

      xhr.send();
    },

    readZones() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${this.url}/zones`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        this.zones = [];

        data.forEach((zone: Zone) => {
          zone.timestamp = new Date(Date.parse(zone.updated_at));
          this.zones.push(zone);
        });
      };

      xhr.send();
    },

    createZone(zone: any) {
      console.log("CREATE ZONE", zone);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${this.url}/zones`);
      xhr.setRequestHeader("Content-Type", "application/json");
      
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        data.timestamp = new Date(Date.parse(data.updated_at));
        this.zones.push(data);
      };

      xhr.send(JSON.stringify(zone));
    },

    updateZone(zone: any) {
      console.log("UPDATE ZONE", zone);
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
