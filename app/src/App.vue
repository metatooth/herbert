<template>
  <div id="app">
    <div class="container">
      <nav class="navbar">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="./assets/logo.png" />
          </a>
        </div>
      </nav>
      <notification
        v-for="notification in notifications"
        v-bind:key="notification.id"
        v-bind:onclose="closeNotification"
        v-bind="notification"
      >
      </notification>
      <section class="section">
        <span>{{ clients.length }} {{ clientsName }}</span>
      </section>
      <section class="section">
        <form class="control">
          <label for="celsius" class="radio">
            <input type="radio" id="celsius" value="C" v-model="units" />
            Celsius
          </label>
          &nbsp;
          <label for="fahrenheit" class="radio">
            <input type="radio" id="fahrenheit" value="F" v-model="units" />
            Fahrenheit
          </label>
        </form>
      </section>
      <section class="section">
        <client-card
          v-for="client in clients"
          v-bind:key="client.id"
          v-bind:units="units"
          v-bind="client"
        >
        </client-card>
      </section>
      <section class="section">
        <div id="configurations"></div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ClientCard from "./components/ClientCard.vue";
import Notification from "./components/Notification.vue";

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
  code: string;
}

@Component({
  components: {
    ClientCard,
    Notification
  }
})
export default class App extends Vue {
  clients: Array<ClientData> = [];
  notifications: Array<NotificationData> = [];
  notify = false;
  serverUrl = process.env.WS_URL || "ws://localhost:5000";
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

  closeNotification(): void {
    console.log("close notification");
    console.log(this.notifications);
    this.notify = false;
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
          console.log("what of this?");
          console.log(data);
          //c.updated_at = data.updated_at;
          found = true;
        }
      });

      if (!found) {
        data.units = this.units;
        data.humidity = 100 * data.humidity;
        this.clients.push(data);
      }
    } else if (data.code) {
      this.notify = true;
      this.notifications.push(data);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
