<script lang="ts">
import { mapActions } from "vuex";

import { Zone } from "@client/store/zones/types";

export default {
  props: {
    locked: Boolean,
    zone: Zone,
  },

  data() {
    return {
      active: this.zone.active,
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
    },
  },

  methods: {
    toggle() {
      this.active = !this.active;
      const zone = {
        ...this.zone,
        active: this.active,
      };
      this.edit(zone);
    },

    ...mapActions("zones", ["edit"]),
  },
};
</script>

<template>
  <button
    class="button"
    :disabled="locked"
    :class="statusClass"
    @click="toggle"
  >
    <span class="icon">
      <font-awesome-icon :icon="statusIcon" />
    </span>
  </button>
</template>
