<template>
  <div class="control">
    <div class="tags has-addons">
      <span class="tag" :class="iconClass">
        <font-awesome-icon :icon="icon" />
      </span>
      <span class="tag" :class="displayClass">
        {{ formatted }} {{ units }}
      </span>
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
    text: { type: String, default: "black" },
    background: { type: String, default: "black-light" },
    size: { type: String, default: "medium" }
  },

  computed: {
    displayClass(): string {
      return `display has-text-${this.text}-bis has-background-${this.background} is-${this.size}`;
    },

    iconClass(): string {
      return `has-text-${this.background} has-background-black-bis is-${this.size}`;
    },

    formatted(): string {
      return this.value.toFixed(this.precision);
    }
  }
});

export default Target;
</script>

<style scoped>
.display {
  width: 60px;
}
</style>
