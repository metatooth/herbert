<template>
  <div class="control">
    <div class="tags has-addons">
      <div class="tag is-medium has-background-dark" :class="onClass">
        <font-awesome-icon :icon="iconClass" />
      </div>
      <div class="tag is-medium has-background-dark" :class="offClass">
        <font-awesome-icon :icon="iconClass" />
      </div>
      <div class="tag is-medium has-background-dark" :class="disconnectedClass">
        <font-awesome-icon :icon="iconClass" />
      </div>
      <div class="tag is-medium has-text-light has-background-dark">
        {{ device.nickname || device.device }}
        <button
          class="delete"
          v-on:click="remove(device.device)"
          @click="remove(device.device)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Device } from "@/store/devices/types";

const DeviceWidget = Vue.extend({
  props: {
    device: Device
  },

  computed: {
    iconClass() {
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
      } else if (this.device.devicetype === "fan") {
        return "fan";
      } else {
        return "circle";
      }
    },

    offClass() {
      if (this.device.status === "off" || this.device.status === "0") {
        return "has-text-warning";
      } else {
        return "has-text-warning-light";
      }
    },

    onClass() {
      if (this.device.status === "on" || this.device.status === "1") {
        return "has-text-success";
      } else {
        return "has-text-success-light";
      }
    },

    disconnectedClass() {
      if (this.device.status === "disconnected") {
        return "has-text-danger";
      } else {
        return "has-text-danger-light";
      }
    }
  },

  methods: {
    remove(device: string) {
      console.log("remove???", device);
      this.$emit("remove-device", device);
    }
  }
});

export default DeviceWidget;
</script>
