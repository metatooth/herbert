<template>
  <div class="control">
    <div class="tags has-addons">
      <span :class="iconClass" :style="text" v-if="!simple">
        <font-awesome-icon :icon="icon" />
      </span>
      <span :class="displayClass" :style="background">
        {{ formatted }}{{ units }}
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
    precision: { type: Number, default: 0 },
    units: String,
    color: { type: String, default: "#ffffff" },
    size: { type: String, default: "medium" },
    simple: { type: Boolean, default: false }
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
    }
  }
});

export default Target;
</script>
