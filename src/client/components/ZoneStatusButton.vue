<template>
  <button class="button" :class="statusClass" @click="toggle">
    <span class="icon">
      <font-awesome-icon :icon="statusIcon" />
    </span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

import { Zone } from "@/store/zones/types";

const ZoneStatusButton = Vue.extend({
  props: {
    zone: Zone
  },

  data() {
    return {
      active: this.zone.active
    };
  },

  computed: {
    statusClass() {
      if (this.active) {
        return "has-text-success";
      } else {
        return "has-text-info";
      }
    },

    statusIcon() {
      if (this.active) {
        return "toggle-on";
      } else {
        return "toggle-off";
      }
    }
  },

  methods: {
    toggle() {
      this.active = !this.active;
      const zone = {
        ...this.zone,
        active: this.active
      };
      console.log("edit zone", zone);

      this.edit(zone);
    },

    ...mapActions("zones", ["edit"])
  }
});

export default ZoneStatusButton;
</script>
