<template>
  <div id="overview">
    <section class="section">
      <div class="tile is-ancestor has-text-centered">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ devicesCount }}</p>
            <p class="subtitle"><a @click="picked('devices')">Devices</a></p>
          </article>
        </div>
        <div class="tile is-parent" @click="picked('profiles')">
          <article class="tile is-child box">
            <p class="title">{{ profilesCount }}</p>
            <p class="subtitle"><a @click="picked('profiles')">Profiles</a></p>
          </article>
        </div>
        <div class="tile is-parent" @click="picked('zones')">
          <article class="tile is-child box">
            <p class="title">{{ zonesCount }}</p>
            <p class="subtitle"><a @click="picked('zones')">Zones</a></p>
          </article>
        </div>
        <div class="tile is-parent" @click="picked('workers')">
          <article class="tile is-child box">
            <p class="title">{{ workersCount }}</p>
            <p class="subtitle"><a @click="picked('workers')">Herberts</a></p>
          </article>
        </div>
      </div>
    </section>
    <section class="section">
      <p class="title">Notifications</p>
      <table class="table is-fullwidth is-striped">
        <thead>
          <th>&nbsp;</th>
          <th>Device</th>
          <th>Message</th>
          <th class="has-text-centered">Delete?</th>
        </thead>
        <tbody>
          <tr v-if="notifications.length === 0">
            <td class="has-text-centered" colspan="4">None!</td>
          </tr>
          <notification
            v-for="notification in notifications"
            v-bind:key="notification.id"
            v-bind="notification"
            @delete-notification="deleteNotification(notification)"
          />
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Notification from "@/components/Notification.vue";

interface NotificationType {
  id: string;
  plug: string;
  action: string;
  code: string;
  message: string;
  timestamp: Date;
}

const Overview = Vue.extend({
  data() {
    return {
      notifications: [] as NotificationType[]
    };
  },

  components: {
    Notification
  },

  computed: {
    ...mapGetters("devices", ["devicesCount"]),
    ...mapGetters("profiles", ["profilesCount"]),
    ...mapGetters("workers", ["workersCount"]),
    ...mapGetters("zones", ["zonesCount"])
  },

  mounted() {
    console.log("Starting connection to WebSocket server...");
    const ws = new WebSocket(process.env.VUE_APP_WS_URL);

    ws.addEventListener("open", (ev: Event) => {
      console.log(ev);
      console.log("Connection open success!");
    });

    ws.addEventListener("message", (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      if (data.type === "ERROR") {
        const n: NotificationType = {
          id: data.payload.device,
          plug: data.payload.device,
          action: data.payload.action,
          code: data.payload.code,
          message: data.payload.message || data.payload.status,
          timestamp: new Date(Date.parse(data.payload.timestamp))
        };
        const index = this.notifications.findIndex((el: NotificationType) => {
          return el.id === n.id;
        });
        if (index !== -1) {
          this.notifications.splice(index, 1, n);
        } else {
          this.notifications.push(n);
        }
      }
    });
  },

  methods: {
    deleteNotification(n: NotificationType): void {
      const found = this.notifications.findIndex(el => el.id === n.id);
      this.notifications.splice(found, 1);
    },

    picked(name: string) {
      this.$emit("child-picked", name);
    }
  }
});
export default Overview;
</script>
