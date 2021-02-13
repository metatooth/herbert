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
    <section class="section">
      <form class="control">
        <label for="celsius" class="radio">
          <input id="celsius" v-model="units" type="radio" value="C" />
          Celsius
        </label>
        &nbsp;
        <label for="fahrenheit" class="radio">
          <input id="fahrenheit" v-model="units" type="radio" value="F" />
          Fahrenheit
        </label>
      </form>
    </section>
    <section class="section">
      <div id="configurations" />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ClientRow from "@/components/ClientRow.vue";
import Notification from "@/components/Notification.vue";

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
    Notification
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
    deleteThisNotification(notification: NotificationData): void {
      this.notifications.splice(this.notifications.indexOf(notification), 1);
    },

    onWebsocketOpen(ev: Event): void {
      console.log(ev);
      console.log("Connection open success!");
    },

    onWebsocketMessage(ev: MessageEvent): void {
      const data = JSON.parse(ev.data);

      if (data.temperature) {
        let found = false;
        this.clients.forEach((c: ClientData) => {
          if (c.id === data.id) {
            c.units = this.units;
            c.temperature = data.temperature;
            c.humidity = 100 * data.humidity;
            c.blower = data.blower ? 1 : 0;
            c.dehumidifier = data.dehumidifier ? 1 : 0;
            c.heater = data.heater ? 1 : 0;
            c.humidifier = data.humidifier ? 1 : 0;
            c.lamp = data.lamp ? 1 : 0;
            c.timestamp = new Date();
            found = true;
          }
        });

        if (!found) {
          const cd: ClientData = {
            id: data.id,
            main: data.main_meter,
            intake: data.intake_meter,
            units: this.units,
            temperature: data.temperature,
            humidity: 100 * data.humidity,
            blower: data.blower ? 1 : 0,
            dehumidifier: data.dehumidifer ? 1 : 0,
            heater: data.heater ? 1 : 0,
            humidifier: data.humidifier ? 1 : 0,
            lamp: data.lamp ? 1 : 0,
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
