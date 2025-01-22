<script lang="ts">
import { mapGetters } from "vuex";

import NotificationRow from "@client/components/NotificationRow.vue";

export default {
  components: {
    NotificationRow,
  },

  emits: ["delete-notification"],

  computed: {
    ...mapGetters("notifications", ["notifications", "notificationsCount"]),
  },

  methods: {
    deleteNotification(notification): void {
      this.$emit("delete-notification", notification);
    },
  },
};
</script>

<template>
  <div id="notifications">
    <h1 class="subtitle is-5">
      <strong>{{ notificationsCount }}</strong>
      Notifications
    </h1>
    <table v-if="notificationsCount !== 0" class="table is-bordered is-striped">
      <thead>
        <tr>
          <th>At</th>
          <th>Name</th>
          <th>What</th>
          <th></th>
        </tr>
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
