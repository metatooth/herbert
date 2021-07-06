<template>
  <div id="overview">
    <section class="section">
      <div class="tile is-ancestor">
        <div class="tile" v-if="zonesCount === 0">
          <p class="title has-text-centered">No zones!</p>
        </div>
        <div class="tile is-4 is-vertical">
          <zone-tile v-for="zone in left" :key="zone.id" :zone="zone" />
        </div>
        <div class="tile is-3 is-vertical">
          <zone-tile v-for="zone in middle" :key="zone.id" :zone="zone" />
        </div>
        <div class="tile is-3 is-vertical">
          <zone-tile v-for="zone in right" :key="zone.id" :zone="zone" />
        </div>
      </div>
    </section>
    <section class="section">
      <div class="tile is-ancestor">
        <div class="tile" v-if="notificationsCount === 0">
          <p class="title has-text-centered">No notifications!</p>
        </div>
        <notification-tile
          v-for="notification in notifications"
          v-bind:key="notification.id"
          v-bind="notification"
          @delete-notification="deleteNotification(notification)"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import NotificationTile from "@/components/NotificationTile.vue";
import { convertToLocalTime } from "date-fns-timezone";
import { Device } from "@/store/devices/types";
import { Notification } from "@/store/notifications/types";
import ZoneTile from "@/components/ZoneTile.vue";

const Overview = Vue.extend({
  components: {
    NotificationTile,
    ZoneTile
  },

  computed: {
    left() {
      const zones = [];
      for (let i = 0; i < this.zonesCount; i = i + 3) {
        if (this.zones[i]) {
          zones.push(this.zones[i]);
        }
      }
      return zones;
    },

    middle() {
      const zones = [];
      for (let i = 1; i < this.zonesCount; i = i + 3) {
        if (this.zones[i]) {
          zones.push(this.zones[i]);
        }
      }
      return zones;
    },

    right() {
      const zones = [];
      for (let i = 2; i < this.zonesCount; i = i + 3) {
        if (this.zones[i]) {
          zones.push(this.zones[i]);
        }
      }
      return zones;
    },
    ...mapGetters("meters", ["meters", "metersCount"]),
    ...mapGetters("devices", ["devices", "devicesCount"]),
    ...mapGetters("notifications", ["notifications", "notificationsCount"]),
    ...mapGetters("profiles", ["profilesCount"]),
    ...mapGetters("workers", ["workersCount"]),
    ...mapGetters("zones", ["zones", "zonesCount"]),
    ...mapGetters("settings", ["settings"])
  },

  mounted() {
    console.log("Starting connection to WebSocket server...");
    const ws = new WebSocket(
      process.env.VUE_APP_WS_URL || "ws://localhost:5000"
    );

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
