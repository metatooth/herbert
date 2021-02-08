<template>
  <div class="notification is-danger">
    <button class="delete" @click="$emit('delete-notification')" />
    <timestamp :timestamp="timestamp" /> --&nbsp;
    <span>{{ plug }}</span> --&nbsp;
    <span>{{ message }}</span>
  </div>
</template>

<script>
import Vue from "vue";
import Timestamp from "@/components/Timestamp.vue";

const Notification = Vue.extend({
  props: {
    id: { type: String, default: "" },
    plug: { type: String, default: "" },
    message: { type: String, default: "" },
    timestamp: { type: String, default: new Date() }
  },

  components: { Timestamp },

  emits: ["delete-notification"]
});

export default Notification;
</script>

<style></style>
