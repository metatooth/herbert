<template>
  <span class="tag has-background-black">
    <font-awesome-icon :class="deviceClass" :icon="deviceIcon" />
  </span>
</template>

<script>
import Vue from "vue";
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
  }
});

export default DeviceTag;
</script>

<style></style>
