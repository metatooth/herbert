<template>
  <div
    class="tag"
    v-bind:class="{ 'is-success': status, 'is-warning': !status }"
  >
    {{ name }}
  </div>
</template>

<script>
export default {
  name: "System",
  props: {
    name: String,
    status: Boolean
  }
};
</script>
