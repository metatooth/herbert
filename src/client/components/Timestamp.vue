<template>
  <span>
    <span v-if="timeago"
      ><em>{{ lapsed }} ago</em></span
    >
    <span v-else class="is-family-code">
      <span v-if="dayold">{{ monthday }} - </span>
      <span
        >{{ hhmm }}<span class="is-size-7">{{ ss }}</span></span
      >
    </span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { convertToLocalTime } from "date-fns-timezone";

const Timestamp = Vue.extend({
  props: {
    timestamp: { default: new Date(), type: Date },
    timezone: { default: "America/New_York", type: String },
    readable: { default: false, type: Boolean }
  },

  data() {
    return {
      timeago: this.readable
    };
  },

  computed: {
    dayold(): boolean {
      const diff = new Date() - this.timestamp;
      if (diff > 86400000) {
        return true;
      }
      return false;
    },

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
      } else {
        return "a long time";
      }
    },

    local(): Date {
      return convertToLocalTime(this.timestamp, { timeZone: this.timezone });
    },

    monthday(): string {
      const mon = this.local.toLocaleString("default", { month: "short" });

      return mon + " " + this.local.getDay();
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
