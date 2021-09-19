<template>
  <button class="button" :class="statusClass" @click="toggle">
    <span class="icon">
      <font-awesome-icon :class="deviceClass" :icon="deviceIcon" />
    </span>
  </button>
</template>

<script>
import Vue from "vue";
import { mapActions } from "vuex";
import { Device } from "@/store/devices/types";

const DeviceTag = Vue.extend({
  props: {
    device: Device
  },

  computed: {
    deviceIcon() {
      if (this.device.status !== "on" && this.device.status !== "off") {
        return "times";
      }

      if (this.device.devicetype === "heater") {
        return "fire-alt";
      } else if (this.device.devicetype === "humidifier") {
        return "tint";
      } else if (this.device.devicetype === "dehumidifier") {
        return "tint-slash";
      } else if (this.device.devicetype === "lamp") {
        return "lightbulb";
      } else if (this.device.devicetype === "blower") {
        return "wind";
      } else if (this.device.devicetype === "cooler") {
        return "snowflake";
      } else if (this.device.devicetype === "irrigator") {
        return "cloud-rain";
      } else if (this.device.devicetype === "fan") {
        return "fan";
      }

      return "circle";
    },

    deviceClass() {
      if (this.device.status === "on" || this.device.status === "1") {
        return "has-text-success icon";
      } else {
        return "has-text-warning icon";
      }
    }
  },

  methods: {
    toggle() {
      if (this.device.status === "on") {
        this.off(this.device.device);
      } else {
        this.on(this.device.device);
      }
    },

    ...mapActions("devices", ["on", "off"])
  }
});

export default DeviceTag;
</script>

<style></style>
