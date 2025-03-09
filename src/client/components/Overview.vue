<script lang="ts">
import { mapGetters, mapActions } from "vuex";
import { convertToLocalTime } from "@shared/utils";
import { io, Socket } from "socket.io-client";

import { messageIsFrom } from "@shared/type-guards";
import { AnySocketMessage, SocketMessageMap } from "@shared/types";
import {
  makeErrorMessage,
  makeSwitchStatusMessage,
} from "@shared/message-creators";

import Collection from "@client/components/Collection.vue";
import NotificationRow from "@client/components/NotificationRow.vue";
import { Device } from "@client/store/devices/types";
import { Notification } from "@client/store/notifications/types";

export default {
  components: {
    Collection,
    NotificationRow,
  },

  props: {
    filter: String,
  },

  computed: {
    activeSet() {
      const active = this.zones.filter((el) => {
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

    ...mapGetters("devices", ["devices"]),
    ...mapGetters("notifications", ["notifications", "notificationsCount"]),
    ...mapGetters("zones", ["zones"]),
  },

  mounted() {
    const ws: Socket<SocketMessageMap> = io(
      import.meta.env.VITE_WSS_URL || "ws://localhost:5000",
    );
    ws.emit("join", { room: "clients" });
    ws.on("message", (msg: AnySocketMessage) => {
      if (messageIsFrom(makeSwitchStatusMessage, msg)) {
        const found = this.devices.filter((d) => {
          return d.device === msg.payload.device;
        });
        if (found.length !== 0) {
          found[0].status = msg.payload.status;
        }
        return;
      }

      if (messageIsFrom(makeErrorMessage, msg)) {
        const n: Notification = {
          id: msg.payload.device,
          plug: msg.payload.device,
          action: msg.payload.action,
          code: msg.payload.code,
          message: msg.payload.message,
          timestamp: new Date(Date.parse(msg.payload.timestamp)),
        };
        this.add(n);
        return;
      }
    });
  },

  methods: {
    checkDeviceHealth(): void {
      const check = new Date();
      this.devices.forEach((d: Device) => {
        const local = convertToLocalTime(d.updatedat || new Date(), {
          timeZone: "America/New_York",
        });
        const diff = check.getTime() - local.getTime();
        if (diff > 5 * 60 * 1000) {
          const formatted = this.pretty(local);

          const n: Notification = {
            id: d.device,
            action: "",
            code: 0,
            plug: d.nickname || d.device,
            message: `Hasn't reported since ${formatted}`,
            timestamp: new Date(),
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

    zeroes(n: number): string {
      if (n < 10) {
        return `0${n}`;
      }
      return n.toString();
    },

    ...mapActions("notifications", ["add", "remove"]),
  },
};
</script>

<template>
  <div id="overview">
    <collection type="zone" :filter="filter" />
    <h1 class="subtitle is-5">Notifications</h1>
    <table
      v-if="notifications.length !== 0"
      class="table is-bordered is-striped"
    >
      <thead>
        <th>At</th>
        <th>Name</th>
        <th>What</th>
        <th></th>
      </thead>
      <tbody>
        <notification-row
          v-for="notification in notifications"
          :key="notification.id"
          v-bind="notification"
          @delete-notification="deleteNotification(notification)"
        />
      </tbody>
    </table>
    <p v-else class="content">All good...</p>
  </div>
</template>
