<template>
  <section class="section">
    <notification
      v-for="notification in notifications"
      :key="notification.id"
      v-bind="notification"
      @delete-notification="deleteNotification(notification)"
    />
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Notification from "@/components/Notification.vue";

interface NotificationType {
  id: number;
}

const Notifications = Vue.extend({
  props: { notifications: Array },

  components: {
    Notification
  },

  methods: {
    deleteNotification(notification: NotificationType): void {
      this.$emit("delete-notification", notification);
    }
  }
});

export default Notifications;
</script>
