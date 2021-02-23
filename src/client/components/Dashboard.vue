<template>
  <div id="dashboard">
    <section class="section">
      <notification
        v-for="notification in notifications"
        :key="notification.id"
        v-bind="notification"
        @delete-notification="deleteThisNotification(notification)"
      />
    </section>
    <section class="section">
      <span>{{ clients.length }} {{ clientsName }}</span>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Updated</th>
            <th>Current Conditions</th>
            <th>Systems</th>
            <th colspan="2">History</th>
          </tr>
        </thead>
        <tbody>
          <client-row
            v-for="client in clients"
            :key="client.id"
            :units="units"
            v-bind="client"
          />
        </tbody>
      </table>
    </section>
    <units-selector :units="units" @change-units="changeUnits" />
    <section class="section">
      <div id="configurations" />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ClientRow from "@/components/ClientRow.vue";
import Notification from "@/components/Notification.vue";
import UnitsSelector from "@/components/UnitsSelector.vue";

interface ClientData {
  id: string;
  main: string;
  intake: string;
  units: string;
  temperature: number;
  humidity: number;
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

const Dashboard = Vue.extend({
  data() {
    return {
      clients: [] as ClientData[],
      notifications: [] as NotificationData[],
      units: "F"
    };
  },

  components: {
    ClientRow,
    Notification,
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

    const xhr = new XMLHttpRequest();
    const url = process.env.VUE_APP_API_URL || "http://localhost:5000";

    xhr.open("GET", `${url}/clients`);

    xhr.onload = () => {
      const data = JSON.parse(xhr.response);
      console.log("clients", data);
      data.forEach((d) => {
        console.log("client", d);

        const cd: ClientData = {
            id: d.client,
            main: d.main,
            intake: d.intake,
            units: this.units,
            timestamp: new Date(d.updated_at)
          };

        this.clients.push(cd);
      });
    };

    xhr.send();
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
          if (c.id === data.payload.id) {
            c.units = this.units;
            c.temperature = data.payload.temperature;
            c.humidity = 100 * data.payload.humidity;
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
            id: data.payload.id,
            main: data.payload.main_meter,
            intake: data.payload.intake_meter,
            units: this.units,
            temperature: data.payload.temperature,
            humidity: 100 * data.payload.humidity,
            blower: data.payload.blower ? 1 : 0,
            dehumidifier: data.payload.dehumidifer ? 1 : 0,
            heater: data.payload.heater ? 1 : 0,
            humidifier: data.payload.humidifier ? 1 : 0,
            lamp: data.payload.lamp ? 1 : 0,
            timestamp: new Date()
          };

          this.clients.push(cd);
        }
      } else if (data.code) {
        let found = false;
        console.log(data.code);
        this.notifications.forEach((nd: NotificationData) => {
          console.log(nd);
          if (nd.id === data.id) {
            nd.plug = data.plug;
            nd.action = data.action;
            nd.code = data.code;
            nd.message = data.message;
            nd.timestamp = new Date();
            found = true;
          }
        });

        if (!found) {
          const nd: NotificationData = {
            id: data.id,
            plug: data.plug,
            action: data.action,
            code: data.code,
            message: data.message,
            timestamp: new Date()
          };

          this.notifications.push(nd);
        }
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
