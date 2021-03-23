<template>
  <span class="is-family-code">
    {{ hhmm }}<span class="is-size-7">{{ ss }}</span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { convertToLocalTime } from "date-fns-timezone";

const Timestamp = Vue.extend({
  props: {
    timestamp: { default: new Date, type: Date },
    timezone: { default: "Etc/UTC", type: String }
  },

  computed: {
    local(): Date {
      return convertToLocalTime(this.timestamp,
                                { timeZone: this.timezone })
    },
    
    hhmm(): string {
      return (
        this.zeroes(this.local.getHours()) +
          ":" +
          this.zeroes(this.local.getMinutes())
      );
    },
    
    ss(): string {
      return ":" + this.zeroes(this.local.getSeconds());
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
