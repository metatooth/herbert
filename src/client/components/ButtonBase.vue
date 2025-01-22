<script lang="ts">
export default {
  props: {
    show: { type: Boolean, default: true },
    label: { type: String, default: "" },
    icon: { type: String, default: "cannabis" },
    size: { type: String, default: "small" },
    color: { type: String, default: "primary" },
  },

  emits: ["on-click"],

  computed: {
    buttonClass() {
      return `button is-${this.size} has-text-${this.color}`;
    },
  },
};
</script>

<template>
  <button v-if="show" :class="buttonClass" @click="$emit('on-click')">
    <font-awesome-icon :icon="icon" />
    <span v-if="label">{{ label }}</span>
  </button>
</template>
