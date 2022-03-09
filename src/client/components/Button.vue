<template>
  <button :class="buttonClass" @click="$emit('on-click')" v-if="show">
    <font-awesome-icon :icon="icon" />
    <span v-if="label">{{ label }}</span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";

const Button = Vue.extend({
  props: {
    show: { type: Boolean, default: true },
    callback: Function,
    label: String,
    icon: { type: String, default: "cannabis" },
    size: { type: String, default: "small" },
    color: { type: String, default: "primary" }
  },

  computed: {
    buttonClass() {
      return `button is-${this.size} has-text-${this.color}`;
    }
  }
});
export default Button;
</script>
