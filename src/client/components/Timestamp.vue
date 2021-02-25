<template>
  <span class="is-family-code">
    {{ hhmm }}<span class="is-size-7">{{ ss }}</span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";

const Timestamp = Vue.extend({
  props: {
    timestamp: { type: Date, default: new Date() }
  },

  computed: {
    hhmm(): string {
      if (this.timestamp instanceof Date) {
        return (
          this.zeroes(this.timestamp.getHours()) +
          ":" +
          this.zeroes(this.timestamp.getMinutes())
        );
      } else {
        return this.timestamp;
      }
    },

    ss(): string {
      if (this.timestamp instanceof Date) {
        return ":" + this.zeroes(this.timestamp.getSeconds());
      } else {
        return "";
      }
    }
  },

  methods: {
    zeroes(n: number): string {
      if (n < 10) {
        return `0${n}`;
      }
      return n.toString();
    }
  }
});
export default Timestamp;
</script>
