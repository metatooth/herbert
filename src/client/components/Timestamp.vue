<template>
  <nav class="level">
    <div class="level-item">
      <span class="icon">
        <font-awesome-icon icon="clock" />
      </span>
      <strong>
        {{ hhmm }}<span class="is-size-7">{{ ss }}</span> {{ part }}
      </strong>
    </div>
    <div class="level-item" v-if="!abbreviated">
      <strong> on {{ mmmddyyyy }} </strong>
    </div>
    <div class="level-item" v-if="!abbreviated">
      <em>Updated <readable :timestamp="local"/></em>
    </div>
    <div class="level-item" v-if="!abbreviated">
      <button class="button" @click="reload">
        <font-awesome-icon icon="sync" />
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { convertToLocalTime } from "date-fns-timezone";
import Readable from "@/components/Readable.vue";

const Timestamp = Vue.extend({
  props: {
    timestamp: { default: new Date(), type: Date },
    abbreviated: { default: false, type: Boolean },
    timezone: { default: "America/New_York", type: String }
  },

  components: {
    Readable
  },

  computed: {
    local(): Date {
      return convertToLocalTime(this.timestamp, { timeZone: this.timezone });
    },

    mmm() {
      return this.timestamp.toLocaleString("default", { month: "long" });
    },

    mmmddyyyy() {
      return (
        this.mmm +
        " " +
        this.zeroes(this.local.getDate()) +
        ", " +
        this.local.getFullYear()
      );
    },

    part() {
      return this.local.getHours() < 12 ? "AM" : "PM";
    },

    hh() {
      return this.local.getHours() < 13
        ? this.local.getHours()
        : this.local.getHours() - 12;
    },

    hhmm(): string {
      return this.hh + ":" + this.zeroes(this.local.getMinutes());
    },

    ss(): string {
      return ":" + this.zeroes(this.local.getSeconds());
    }
  },

  methods: {
    reload() {
      window.location.reload(true);
    },

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
