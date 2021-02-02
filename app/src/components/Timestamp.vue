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
    timestamp: Date
  }
});

@Component({})
export default class Timestamp extends TimestampProps {
  get hhmm(): string {
    return (
      this.zeroes(this.timestamp.getHours()) +
      ":" +
      this.zeroes(this.timestamp.getMinutes())
    );
  }

  get ss(): string {
    return this.zeroes(this.timestamp.getSeconds());
  }

  zeroes(n) {
    if (n < 10) {
      return "0" + n;
    }
    return n;
  }
}
</script>

<style></style>
