<script>
import Timestamp from "@client/components/Timestamp.vue";

export default {
  components: { Timestamp },

  props: {
    id: { type: String, default: "" },
    plug: { type: String, default: "" },
    message: { type: String, default: "" },
    timestamp: { type: Date, default: new Date() },
  },

  emits: ["delete-notification"],
};
</script>

<template>
  <div class="tile is-child notification">
    <p class="title">
      <timestamp :timestamp="timestamp" :readable="true" />
    </p>
    <p class="subtitle">
      {{ plug }}
    </p>
    <p class="content">
      {{ message }}
    </p>
    <button class="delete" @click="$emit('delete-notification')" />
  </div>
</template>
