<template>
  <div class="tile is-parent">
    <notification-tile
      v-for="notification in notifications"
      :key="notification.id"
      v-bind="notification"
      @delete-notification="deleteNotification(notification)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import NotificationTile from "@/components/NotificationTile.vue";

interface NotificationType {
  id: number;
}

const Notifications = Vue.extend({
  props: { notifications: Array },

  components: {
    NotificationTile
  },

  methods: {
    deleteNotification(notification: NotificationType): void {
      this.$emit("delete-notification", notification);
    }
  }
});

export default Notifications;
</script>
