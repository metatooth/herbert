<template>
  <span class="tag" :class="stateClass">
    {{ name }}
  </span>
</template>

<script lang="ts">
import Vue from "vue";

enum SystemStatus {
  OFF = 0,
  ON = 1,
  ERROR = 2,
}

const SystemDisplay = Vue.extend({
  name: "SystemDisplay",
  props: {
    name: { type: String, default: "" },
    status: { type: Number, default: 0 },
  },
  computed: {
    stateClass() {
      if (this.status === SystemStatus.ON) {
        return "is-success";
      } else if (this.status === SystemStatus.OFF) {
        return "is-warning";
      } else {
        return "is-danger";
      }
    },
  },
});
export default SystemDisplay;
</script>
