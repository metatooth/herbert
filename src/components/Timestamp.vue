<template>
  <span class="is-family-code">
    {{ hhmm }}<span class="is-size-7">:{{ ss }}</span>
  </span>
</template>

<script>
export default {
  name: "Timestamp",
  props: {
    timestamp: String
  },
  computed: {
    hhmm() {
      const date = new Date(this.timestamp);
      return (
        this.zeroes(date.getHours()) + ":" + this.zeroes(date.getMinutes())
      );
    },
    ss() {
      const date = new Date(this.timestamp);
      return this.zeroes(date.getSeconds());
    }
  },
  methods: {
    zeroes(n) {
      if (n < 10) {
        return "0" + n;
      }
      return n;
    }
  }
};
</script>

<style></style>
