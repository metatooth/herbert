<template>
  <nav class="level">
    <div class="level-item">
      <status-fact :device="device" :width="width" :height="height" />
    </div>
    <div class="level-item">
      <button class="button" :disabled="locked" @click="toggle">
        <font-awesome-icon :class="deviceClass" :icon="device.icon" />
        <span>{{ device.devicetype }}</span>
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";

import { Device } from "@/store/meters/types";

import StatusFact from "@/components/StatusFact.vue";

const DeviceActual = Vue.extend({
  props: {
    device: Device,
    locked: { type: Boolean, default: true },
    width: { type: String, default: "300px" },
    height: { type: String, default: "50px" },
  },

  data() {
    return {
      ts: new Date(),
    };
  },

  components: {
    StatusFact,
  },

  computed: {
    deviceClass(): string {
      let style;
      console.log("deviceClass", this.device.device, this.device.status);
      if (this.device.status === "disconnected") {
        style = "icon has-text-danger";
      } else if (this.device.status === "on") {
        style = "icon has-text-success";
      } else if (this.device.status === "off") {
        style = "icon has-text-warning";
      } else {
        style = "icon has-text-info";
      }

      return style;
    },

    status() {
      return this.device.status === "on";
    },
  },

  methods: {
    toggle() {
      this.$emit("on-toggle");
    },
  },
});

export default DeviceActual;
</script>
