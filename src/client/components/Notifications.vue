<template>
  <div id="notifications">
    <h1 class="subtitle is-5">
      <strong>{{ notificationsCount }}</strong>
      Notifications
    </h1>
    <table class="table is-bordered is-striped" v-if="notificationsCount !== 0">
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
    <p class="content" v-else>All good...</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import NotificationRow from "@/components/NotificationRow.vue";

const Notifications = Vue.extend({
  components: {
    NotificationRow
  },

  computed: {
    ...mapGetters("notifications", ["notifications", "notificationsCount"])
  },

  methods: {
    deleteNotification(notification: NotificationType): void {
      this.$emit("delete-notification", notification);
    }
  }
});

export default Notifications;
</script>
