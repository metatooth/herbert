<template>
  <tr>
    <td><timestamp :timestamp="timestamp" :abbreviated="true" /></td>
    <td>{{ name }}</td>
    <td>{{ message }}</td>
    <td class="has-text-centered">
      <button class="delete" @click="$emit('delete-notification')" />
    </td>
  </tr>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

import Timestamp from "@/components/Timestamp.vue";

const NotificationRow = Vue.extend({
  props: {
    id: { type: String, default: "" },
    plug: { type: String, default: "" },
    message: { type: String, default: "" },
    timestamp: { type: Date, default: new Date() },
  },

  components: { Timestamp },

  computed: {
    notificationClass() {
      return "notification is-danger";
    },

    name() {
      const found = this.devices.filter((d) => {
        return d.device === this.plug;
      });
      if (found.length !== 0) {
        return found[0].name;
      } else {
        return this.plug;
      }
    },

    ...mapGetters("devices", ["devices"]),
  },

  emits: ["delete-notification"],
});

export default NotificationRow;
</script>

<style></style>
