<template>
  <div id="overview">
    <section class="section">
      <div class="tile is-ancestor">
        <div class="tile" v-if="activeCount === 0">
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
import { messageIsFrom } from "../../shared/type-guards";
import { io, Socket } from "socket.io-client";
import {
  makeErrorMessage,
  makeSwitchStatusMessage
} from "../../shared/message-creators";
import { AnySocketMessage, SocketMessageMap } from "../../shared/types";

const Overview = Vue.extend({
  props: {
    filter: String
  },

  components: {
    NotificationTile,
    ZoneTile
  },

  computed: {
    activeSet() {
      const active = this.zones.filter(el => {
        return el.nickname.match(this.filter);
      });
      return active.sort((a, b) => {
        return a.nickname > b.nickname;
      });
    },

    activeCount() {
      return this.activeSet.length;
    },

    left() {
      const zones = [];
      for (let i = 0; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          zones.push(this.activeSet[i]);
        }
      }
      return zones;
    },

    middle() {
      const zones = [];
      for (let i = 1; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          zones.push(this.activeSet[i]);
        }
      }
      return zones;
    },

    right() {
      const zones = [];
      for (let i = 2; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          zones.push(this.activeSet[i]);
        }
      }
      return zones;
    },

    ...mapGetters("notifications", ["notifications", "notificationsCount"]),
    ...mapGetters("zones", ["zones"])
  },

  mounted() {
    const ws: Socket<SocketMessageMap> = io(
      process.env.VUE_APP_WS_URL || "ws://localhost:5000"
    );
    ws.emit("join", { room: "clients" });
    ws.on("message", (msg: AnySocketMessage) => {
      if (messageIsFrom(makeSwitchStatusMessage, msg)) {
        const n: Notification = {
          id: msg.payload.device,
          action: "",
          code: "",
          plug: msg.payload.device,
          message: msg.payload.status,
          timestamp: new Date(Date.parse(msg.payload.timestamp))
        };
        this.add(n);
        return;
      }
      if (messageIsFrom(makeErrorMessage, msg)) {
        const n: Notification = {
          id: msg.payload.device,
          plug: msg.payload.device,
          action: msg.payload.action,
          code: msg.payload.code,
          message: msg.payload.message,
          timestamp: new Date(Date.parse(msg.payload.timestamp))
        };
        this.add(n);
        return;
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
        if (diff > 5 * 60 * 1000) {
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
