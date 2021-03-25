<template>
  <div class="control">
    <div class="tags has-addons">
      <span :class="iconClass">
        <font-awesome-icon :icon="icon" />
      </span>
      <span :class="displayClass"> {{ formatted }} {{ units }} </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const Target = Vue.extend({
  props: {
    icon: String,
    value: Number,
    precision: Number,
    units: String,
    color: { type: String, default: "black" },
    size: { type: String, default: "medium" }
  },

  computed: {
    displayClass(): string {
      return `tag has-text-black-bis has-background-${this.color} is-${this.size}`;
    },

    iconClass(): string {
      return `tag has-text-${this.color} has-background-black-bis is-${this.size}`;
    },

    formatted(): string {
      return this.value.toFixed(this.precision);
    }
  }
});

export default Target;
</script>
