<template>
  <div id="app">
    <div class="container">
      <nav class="navbar">
        <div class="navbar-brand">
          <a
            class="navbar-item"
            href="/"
          >
            <img src="../../assets/images/logo.png">
          </a>
        </div>
      </nav>
      <notification
        v-for="notification in notifications"
        :key="notification.id"
        v-bind="notification"
        @delete-notification="deleteThisNotification(notification)"
      />
      <section class="section">
        <span>{{ clients.length }} {{ clientsName }}</span>
      </section>
      <section class="section">
        <form class="control">
          <label
            for="celsius"
            class="radio"
          >
            <input
              id="celsius"
              v-model="units"
              type="radio"
              value="C"
            >
            Celsius
          </label>
          &nbsp;
          <label
            for="fahrenheit"
            class="radio"
          >
            <input
              id="fahrenheit"
              v-model="units"
              type="radio"
              value="F"
            >
            Fahrenheit
          </label>
        </form>
      </section>
      <section class="section">
        <client-card
          v-for="client in clients"
          :key="client.id"
          :units="units"
          v-bind="client"
        />
      </section>
      <section class="section">
        <div id="configurations" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ClientCard from 'Components/ClientCard.vue';
import Notification from 'Components/Notification.vue';

interface ClientData {
  id: string;
  units: string;
  temperature: number;
  humidity: number;
  blower: boolean;
  dehumidifier: boolean;
  heater: boolean;
  humidifier: boolean;
  lamp: boolean;
  timestamp: string;
}

interface NotificationData {
  id: string;
  plug: string;
  action: string;
  code: string;
  message: string;
  timestamp: string;
}

@Component({ components: [ Notification, ClientCard ] })
export default class App extends Vue {
  clients: Array<ClientData> = [];
  notifications: Array<NotificationData> = [];
  serverUrl = process.env.WS_URL || "ws://localhost:3000";
  units = "F";

  mounted() {
    console.log("Starting connection to WebSocket server...");
    const ws = new WebSocket(this.serverUrl);
    ws.addEventListener("open", (ev: Event) => {
      this.onWebsocketOpen(ev);
    });
    ws.addEventListener("message", (ev: MessageEvent) => {
      this.onWebsocketMessage(ev);
    });
  }

  get clientsName(): string {
    if (this.clients.length === 1) {
      return "client";
    } else {
      return "clients";
    }
  }

  deleteThisNotification(notification: NotificationData): void {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

  onWebsocketOpen(ev: Event): void {
    console.log(ev);
    console.log("Connection open success!");
  }

  onWebsocketMessage(ev: MessageEvent): void {
    const data = JSON.parse(ev.data);

    if (data.temperature) {
      let found = false;
      this.clients.forEach((c: ClientData) => {
        if (c.id === data.id) {
          c.units = this.units;
          c.temperature = data.temperature;
          c.humidity = 100 * data.humidity;
          c.blower = data.blower;
          c.dehumidifier = data.dehumidifier;
          c.heater = data.heater;
          c.humidifier = data.humidifier;
          c.lamp = data.lamp;
          c.timestamp = new Date().toString();
          found = true;
        }
      });

      if (!found) {
        const cd: ClientData = {
          id: data.id,
          units: this.units,
          temperature: data.temperature,
          humidity: 100 * data.humidity,
          blower: data.blower,
          dehumidifier: data.dehumidifer,
          heater: data.heater,
          humidifier: data.humidifier,
          lamp: data.lamp,
          timestamp: new Date().toString()
        };

        this.clients.push(cd);
      }
    } else if (data.code) {
      let found = false;
      this.notifications.forEach((nd: NotificationData) => {
        if (nd.id === data.id) {
          nd.plug = data.plug;
          nd.action = data.action;
          nd.code = data.code;
          nd.message = data.message;
          nd.timestamp = new Date().toString();
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
          timestamp: new Date().toString()
        };

        this.notifications.push(nd);
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  margin-top: 20px;
}
</style>
