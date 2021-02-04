<template>
  <span class="is-family-code">
    {{ hhmm }}<span class="is-size-7">:{{ ss }}</span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

const TimestampProps = Vue.extend({
  props: {
    timestamp: { type: String, default: new Date() }
  }
});

@Component({})
export default class Timestamp extends TimestampProps {
  get hhmm(): string {
    const date = new Date(this.timestamp);
    return this.zeroes(date.getHours()) + ":" + this.zeroes(date.getMinutes());
  }

  get ss(): string {
    const date = new Date(this.timestamp);
    return this.zeroes(date.getSeconds());
  }

  zeroes(n: number): string {
    if (n < 10) {
      return `0${n}`;
    }
    return n.toString();
  }
}
</script>

<style></style>
