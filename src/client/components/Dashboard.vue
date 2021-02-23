<template>
  <div id="dashboard">
    <notifications
      v-bind:notifications="notifications"
      @delete-notification="deleteThisNotification(notification)"
    />
    <grow-environments v-bind:clients="clients" :units="units" />
    <grow-profiles v-bind:profiles="profiles" :units="units" />
    <client-configurations v-bind:clients="clients" :units="units" />
    <units-selector :units="units" @change-units="changeUnits" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ClientConfigurations from "@/components/ClientConfigurations.vue";
import GrowEnvironments from "@/components/GrowEnvironments.vue";
import Notifications from "@/components/Notifications.vue";
import UnitsSelector from "@/components/UnitsSelector.vue";
import GrowProfiles from "@/components/GrowProfiles.vue";

interface ClientData {
  id: string;
  main: string;
  intake: string;
  units: string;
  temperature: number;
  humidity: number;
  pressure: number;
  blower: number;
  dehumidifier: number;
  heater: number;
  humidifier: number;
  lamp: number;
  timestamp: Date;
}

interface NotificationData {
  id: string;
  plug: string;
  action: string;
  code: string;
  message: string;
  timestamp: Date;
}

interface ProfileData {
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

const Dashboard = Vue.extend({
  data() {
    return {
      clients: [] as ClientData[],
      notifications: [] as NotificationData[],
      profiles: [] as ProfileData[],
      units: "F"
    };
  },

  components: {
    ClientConfigurations,
    GrowEnvironments,
    GrowProfiles,
    Notifications,
    UnitsSelector
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

    this.refreshClients();
    this.refreshProfiles();
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

    deleteThisNotification(notification: NotificationData): void {
      this.notifications.splice(this.notifications.indexOf(notification), 1);
    },

    onWebsocketOpen(ev: Event): void {
      console.log(ev);
      console.log("Connection open success!");
    },

    onWebsocketMessage(ev: MessageEvent): void {
      const data = JSON.parse(ev.data);
      console.log("message with data", data);
      if (data.type === "STATUS") {
        let found = false;
        this.clients.forEach((c: ClientData) => {
          if (c.id === data.payload.client) {
            c.units = this.units;
            c.temperature = data.payload.main.temperature;
            c.humidity = 100 * data.payload.main.humidity;
            c.pressure = data.payload.main.pressure / 1000;
            c.blower = data.payload.blower ? 1 : 0;
            c.dehumidifier = data.payload.dehumidifier ? 1 : 0;
            c.heater = data.payload.heater ? 1 : 0;
            c.humidifier = data.payload.humidifier ? 1 : 0;
            c.lamp = data.payload.lamp ? 1 : 0;
            c.timestamp = new Date();
            found = true;
          }
        });

        if (!found) {
          const cd: ClientData = {
            id: data.payload.client,
            main: data.payload.main.meter,
            intake: data.payload.intake.meter,
            units: this.units,
            temperature: data.payload.main.temperature,
            humidity: 100 * data.payload.main.humidity,
            pressure: data.payload.main.pressure / 1000,
            blower: data.payload.blower ? 1 : 0,
            dehumidifier: data.payload.dehumidifer ? 1 : 0,
            heater: data.payload.heater ? 1 : 0,
            humidifier: data.payload.humidifier ? 1 : 0,
            lamp: data.payload.lamp ? 1 : 0,
            timestamp: new Date()
          };

          this.clients.push(cd);
        }
      } else if (data.type === "ERROR") {
        let found = false;
        console.log("ERROR", data.payload);
        this.notifications.forEach((nd: NotificationData) => {
          console.log(nd);
          if (nd.id === data.payload.id) {
            nd.plug = data.payload.plug;
            nd.action = data.payload.action;
            nd.code = data.payload.code;
            nd.message = data.payload.message;
            nd.timestamp = new Date();
            found = true;
          }
        });

        if (!found) {
          const nd: NotificationData = {
            id: data.payload.id,
            plug: data.payload.plug,
            action: data.payload.action,
            code: data.payload.code,
            message: data.payload.message,
            timestamp: new Date()
          };

          this.notifications.push(nd);
        }
      } else {
        console.log("Unhandled Message", data);
      }
    },

    refreshClients() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL || "http://localhost:5000";

      xhr.open("GET", `${url}/clients`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        console.log("clients", data);
        this.clients = [];

        data.forEach((d: any) => {
          console.log("client", d);

          const cd: ClientData = {
            id: d.client,
            main: d.main,
            intake: d.intake,
            temperature: 0,
            humidity: 0,
            pressure: 0,
            lamp: 0,
            blower: 0,
            heater: 0,
            dehumidifier: 0,
            humidifier: 0,
            units: this.units,
            timestamp: new Date(d.updated_at)
          };

          this.clients.push(cd);
        });
      };

      xhr.send();
    },

    refreshProfiles() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL || "http://localhost:5000";

      xhr.open("GET", `${url}/profiles`);

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        console.log("profiles", data);
        this.profiles = [];
        data.forEach((d: any) => {
          console.log("profile", d);

          const start = d.lamp_start.split(":");
          console.log("lamp start", start);
          console.log("lamp duration", d.lamp_duration);
          console.log("lamp duration hours", d.lamp_duration["hours"]);

          const pd: ProfileData = {
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
