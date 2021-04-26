<template>
  <div id="overview">
    <section class="section">
      <div class="tile is-ancestor has-text-centered">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ metersCount }}</p>
            <p class="subtitle"><a @click="picked('meters')">Meters</a></p>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ devicesCount }}</p>
            <p class="subtitle"><a @click="picked('devices')">Devices</a></p>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ profilesCount }}</p>
            <p class="subtitle"><a @click="picked('profiles')">Profiles</a></p>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">{{ zonesCount }}</p>
            <p class="subtitle"><a @click="picked('zones')">Zones</a></p>
          </article>
        </div>
      </div>
    </section>
    <section class="section">
      <table class="table is-fullwidth is-bordered">
        <tbody>
          <tr v-if="notificationsCount === 0">
            <td class="has-text-centered" colspan="4">None!</td>
          </tr>
          <notification-row
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
import { mapGetters, mapActions } from "vuex";
import NotificationRow from "@/components/NotificationRow.vue";
import { convertToLocalTime } from "date-fns-timezone";
import { Device } from "@/store/devices/types";
import { Notification } from "@/store/notifications/types";

const Overview = Vue.extend({
  components: {
    NotificationRow
  },

  computed: {
    ...mapGetters("meters", ["meters", "metersCount"]),
    ...mapGetters("devices", ["devices", "devicesCount"]),
    ...mapGetters("notifications", ["notifications", "notificationsCount"]),
    ...mapGetters("profiles", ["profilesCount"]),
    ...mapGetters("workers", ["workersCount"]),
    ...mapGetters("zones", ["zonesCount"]),
    ...mapGetters("settings", ["settings"])
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
      if (data.type === "STATUS" && data.payload.status === "disconnected") {
        const n: Notification = {
          id: data.payload.device,
          action: "",
          code: "",
          plug: data.payload.nickname || data.payload.device,
          message: data.payload.status,
          timestamp: new Date(Date.parse(data.payload.timestamp))
        };
        this.add(n);
      } else if (data.type === "ERROR") {
        const n: Notification = {
          id: data.payload.device,
          plug: data.payload.nickname || data.payload.device,
          action: data.payload.action,
          code: data.payload.code,
          message: data.payload.message || data.payload.status,
          timestamp: new Date(Date.parse(data.payload.timestamp))
        };
        this.add(n);
      }
    });

    this.checkDeviceHealth();
  },

  methods: {
    checkDeviceHealth(): void {
      const check = Date.now();
      this.devices.forEach((d: Device) => {
        const local = convertToLocalTime(d.timestamp || new Date(), {
          timeZone: "America/New_York"
        });
        const diff = check - local.getTime();
        console.log("check health", d.device, d.timestamp, diff);
        if (diff > 5 * 60 * 1000) {
          console.log("TOO LONG!");
          const formatted = this.pretty(local);

          const n: Notification = {
            id: d.device,
            action: "",
            code: "",
            plug: d.nickname || d.device,
            message: `Hasn't reported since ${formatted}`,
            timestamp: new Date()
          };
          this.add(n);
        }
      });

      setTimeout(this.checkDeviceHealth, this.settings.refresh);
    },

    deleteNotification(n: Notification): void {
      this.remove(n);
    },

    pretty(ts: Date): string {
      return this.zeroes(ts.getHours()) + ":" + this.zeroes(ts.getMinutes());
    },

    picked(name: string) {
      this.$emit("child-picked", name);
    },

    zeroes(n: number): string {
      if (n < 10) {
        return `0${n}`;
      }
      return n.toString();
    },

    ...mapActions("notifications", ["add", "remove"])
  }
});
export default Overview;
</script>
