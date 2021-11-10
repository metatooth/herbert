<template>
  <div class="tags has-addons" @click="clicked">
    <span class="tag has-background-black-bis is-medium">
      <strong
        ><span :style="text">{{ name }}</span></strong
      >
    </span>
    <span class="tag has-text-black-bis is-medium" :style="background">
      {{ zone.profile.profile.slice(0, 12) }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import { zeroes } from "../../shared/utils";

const ZoneTag = Vue.extend({
  props: {
    zone: Zone
  },

  data() {
    return {
      now: new Date()
    };
  },

  computed: {
    background() {
      if (this.zone.isDay(this.now)) {
        return "background-color: #ffe08a";
      } else {
        return "background-color: #7a7a7a";
      }
    },

    text() {
      if (this.zone.isDay(this.now)) {
        return "color: #ffe08a";
      } else {
        return "color: #7a7a7a";
      }
    },

    name(): string {
      const tokens = this.zone.nickname.split(" ");

      if (tokens.length === 2) {
        return `${tokens[0].slice(0, 5)}${zeroes(tokens[1])}`;
      } else if (tokens.length === 1) {
        return tokens[0];
      }

      return this.zone.nickname;
    }
  },

  methods: {
    clicked() {
      this.$router.push({
        name: "zone",
        params: { id: this.zone.id }
      });
    }
  }
});

export default ZoneTag;
</script>

<style scoped>
.tags:hover {
  cursor: pointer;
}
</style>
