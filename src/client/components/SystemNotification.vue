<template>
  <tr class="notification is-danger">
    <td><timestamp :timestamp="timestamp" /></td>
    <td>{{ plug }}</td>
    <td>{{ message }}</td>
    <td class="has-text-centered">
      <button class="delete" @click="$emit('delete-notification')" />
    </td>
  </tr>
</template>

<script>
import Vue from "vue";
import Timestamp from "@/components/Timestamp.vue";

const Notification = Vue.extend({
  props: {
    id: { type: String, default: "" },
    plug: { type: String, default: "" },
    message: { type: String, default: "" },
    timestamp: { type: Date, default: new Date() },
  },

  components: { Timestamp },

  emits: ["delete-notification"],
});

export default Notification;
</script>

<style></style>
