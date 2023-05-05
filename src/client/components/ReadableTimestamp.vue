<template>
  <span> {{ lapsed }} ago </span>
</template>

<script lang="ts">
import Vue from "vue";

const Readable = Vue.extend({
  props: {
    timestamp: {
      default: () => {
        return new Date();
      },
      type: Date,
    },
  },

  computed: {
    lapsed(): string {
      const diff = new Date() - this.timestamp;
      if (diff < 30000) {
        return "seconds";
      } else if (diff < 60000) {
        return `${(diff / 1000).toFixed(0)} secs`;
      } else if (diff < 3600000) {
        const mins = diff / 60000;
        if (mins < 2) {
          return "1 minute";
        } else {
          return `${mins.toFixed(0)} mins`;
        }
      } else if (diff < 86400000) {
        const hrs = diff / 3600000;
        if (hrs < 2) {
          return "1 hour";
        } else {
          return `${hrs.toFixed(0)} hrs`;
        }
      } else if (diff < 604800000) {
        const days = diff / 86400000;
        if (days < 2) {
          return "1 day";
        } else {
          return `${days.toFixed(0)} days`;
        }
      } else {
        return "a long time";
      }
    },
  },
});
export default Readable;
</script>
