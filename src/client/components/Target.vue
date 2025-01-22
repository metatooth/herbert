<script lang="ts">
export default {
  props: {
    icon: String,
    value: Number,
    precision: { type: Number, default: 0 },
    units: String,
    color: { type: String, default: "#ffffff" },
    size: { type: String, default: "medium" },
    simple: { type: Boolean, default: false },
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
};
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
