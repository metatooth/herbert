<template>
  <button
    class="button"
    :disabled="locked"
    :class="deviceClass"
    @click="toggle"
  >
    <span class="icon">
      <font-awesome-icon :icon="deviceIcon" />
    </span>
  </button>
</template>

<script>
import Vue from "vue";
import { mapActions } from "vuex";
import { Device } from "@/store/devices/types";

const DeviceTag = Vue.extend({
  props: {
    device: Device,
    locked: Boolean
  },

  data() {
    return {
      status: this.device.status
    };
  },

  computed: {
    deviceIcon() {
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
      if (this.status === "disconnected") {
        return "has-text-danger";
      } else if (this.status === "on" || this.status === "1") {
        return "has-text-success";
      } else {
        return "has-text-warning";
      }
    }
  },

  methods: {
    toggle() {
      if (this.status === "on") {
        this.off(this.device.device);
        this.status = "off";
      } else {
        this.on(this.device.device);
        this.status = "on";
      }
    },

    ...mapActions("devices", ["on", "off"])
  }
});

export default DeviceTag;
</script>

<style></style>
