<template>
  <span class="control" v-if="show">
    <button :class="display" @click="$emit('on-click')">
      <font-awesome-icon :icon="icon" />
      <span v-if="label">{{ label }}</span>
    </button>
  </span>
</template>

<script lang="ts">
import Vue from "vue";

const Button = Vue.extend({
  props: {
    show: Boolean,
    callback: Function,
    label: String,
    icon: { type: String, default: "cannabis" },
    size: { type: String, default: "small" },
    color: { type: String, default: "primary" }
  },

  computed: {
    display() {
      return `button is-${this.size} is-${this.color}`;
    }
  }
});
export default Button;
</script>
