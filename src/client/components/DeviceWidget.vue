<template>
  <div class="control">
    <div class="tags has-addons">
      <div class="tag is-medium" :class="onClass">
        <font-awesome-icon :icon="iconClass" />
      </div>
      <div class="tag is-medium" :class="offClass">
        <font-awesome-icon :icon="iconClass" />
      </div>
      <div class="tag is-medium" :class="disconnectedClass">
        <font-awesome-icon :icon="iconClass" />
      </div>
      <div class="tag is-medium">
        {{ device.nickname || device.device }}
      </div>
      <div class="tag is-delete is-medium" v-on:click="remove(device.device)" />
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
      if (this.device.status === "off") {
        return "has-text-warning";
      } else {
        return "has-text-warning-light";
      }
    },
    
    onClass() {
      if (this.device.status === "on") {
        return "has-text-success";
      } else {
        return "has-text-success-light";
      }
    },
    
    disconnectedClass(){
      if (this.device.status === "disconnected") {
        return "has-text-danger";
      } else {
        return "has-text-danger-light";
      }
    }
  },
  
  methods: {
    remove(device: string) {
      this.$emit("remove-device", device);
    }
  }
});

export default DeviceWidget;
</script>
