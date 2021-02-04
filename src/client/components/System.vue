<template>
  <div
    class="tag"
    :class="{ 'is-success': status, 'is-warning': !status }"
  >
    {{ name }}
  </div>
</template>

<script lang="ts">
export default {
  name: "System",
  props: {
    name: { type: String, default: '' },
    status: Boolean
  }
};
</script>
