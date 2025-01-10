<script lang="ts">
import Vue from "vue";

const ButtonBase = Vue.extend({
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
export default ButtonBase;
</script>

<template>
  <button v-if="show" :class="buttonClass" @click="$emit('on-click')">
    <font-awesome-icon :icon="icon" />
    <span v-if="label">{{ label }}</span>
  </button>
</template>
