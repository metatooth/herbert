<template>
  <div class="tags has-addons">
    <span class="tag" :class="iconClass">
      <font-awesome-icon :icon="icon" />
    </span>
    <span class="tag" :class="displayClass">
      {{ formatted }} {{ units }}
      </span>
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
    text: String,
    background: String
  },

  computed: {
    displayClass(): string {
      return `display has-text-${this.text}-bis has-background-${this.background}`;
    },

    iconClass(): string {
      return `has-text-${this.background} has-background-black-bis`;
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
