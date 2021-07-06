<template>
  <div class="tile is-child notification">
    <p class="title">
      <timestamp :timestamp="timestamp" :readable="true" />
    </p>
    <p class="subtitle">{{ plug }}</p>    
    <p class="content">{{ message }}</p>
    <button class="delete" @click="$emit('delete-notification')" />
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
    timestamp: { type: Date, default: new Date() }
  },

  components: { Timestamp },

  emits: ["delete-notification"]
});

export default Notification;
</script>

<style></style>
