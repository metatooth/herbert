<template>
  <div class="control">
    <div class="tags has-addons">
      <span :class="iconClass" :style="iconStyle">
        <font-awesome-icon :icon="icon" />
      </span>
      <span :class="textClass" :style="textStyle">
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const IconAndText = Vue.extend({
  props: {
    icon: { type: String, default: "lightbulb" },
    text: { type: String, default: "Lightbulb" },
    color: { type: String, default: "black" },
    size: { type: String, default: "medium" },
    backgroundColor: { type: String, default: "#ffe08a" },
    iconColor: { type: String, default: "#ffe08a" },
  },

  computed: {
    textStyle() {
      return `background-color: ${this.backgroundColor};`;
    },

    textClass() {
      return `tag has-text-${this.color}-bis is-${this.size}`;
    },

    iconClass() {
      return `tag has-background-${this.color}-bis is-${this.size}`;
    },

    iconStyle() {
      return `color: ${this.iconColor};`;
    },
  },
});

export default IconAndText;
</script>
