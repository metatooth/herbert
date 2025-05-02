<script lang="ts">
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
  <tr class="notification is-danger">
    <td><timestamp :timestamp="timestamp" /></td>
    <td>{{ plug }}</td>
    <td>{{ message }}</td>
    <td class="has-text-centered">
      <button class="delete" @click="$emit('delete-notification')" />
    </td>
  </tr>
</template>
