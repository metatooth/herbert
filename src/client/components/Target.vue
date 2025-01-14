<script lang="ts">
import Vue from "vue";

const Target = Vue.extend({
  props: {
    icon: string,
    value: number,
    precision: { type: number, default: 0 },
    units: string,
    color: { type: string, default: "#ffffff" },
    size: { type: string, default: "medium" },
    simple: { type: boolean, default: false },
  },

  computed: {
    background(): string {
      return `background-color: ${this.color};`;
    },

    text(): string {
      return `color: ${this.color};`;
    },

    displayClass(): string {
      return `tag has-text-black-bis has-text-weight-bold is-${this.size}`;
    },

    iconClass(): string {
      return `tag has-background-black-bis is-${this.size}`;
    },

    formatted(): string {
      return this.value.toFixed(this.precision);
    },
  },
});

export default Target;
</script>

<template>
  <div class="control">
    <div class="tags has-addons">
      <span v-if="!simple" :class="iconClass" :style="text">
        <font-awesome-icon :icon="icon" />
      </span>
      <span :class="displayClass" :style="background">
        {{ formatted }}{{ units }}
      </span>
    </div>
  </div>
</template>
