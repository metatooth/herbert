<template>
  <div class="control">
    <div class="tags has-addons">
      <div class="tag is-medium has-background-dark" :class="tagClass" @click="toggle">
        <font-awesome-icon :icon="iconClass" />
      </div>
      <span class="tag is-medium has-text-light has-background-dark">
        <router-link
          :to="{
            name: 'statuses',
            params: { name: device.nickname, device: device.device }
          }"
        >
          &gt;&gt;&gt;
        </router-link>
      </span>
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
import { mapState, mapActions } from "vuex";
import { Device } from "@/store/devices/types";
import { Notification } from "@/store/notifications/types";

const DeviceWidget = Vue.extend({
  props: {
    device: Device
  },

  data() {
    return {
      updating: false
    };
  },

  watch: {
    device() {
      this.updating = false;
    }
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
      } else if (this.device.devicetype === "cooler") {
        return "snowflake";
      } else if (this.device.devicetype === "fan") {
        return "fan";
      } else {
        return "circle";
      }
    },

    tagClass() {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.device.device;
      });
      if (found) {
        return "has-text-danger";
      } else if (this.device.status === "off" || this.device.status === "0") {
        return "has-text-warning";
      } else if (this.device.status === "on" || this.device.status === "1") {
        return "has-text-success";
      } else {
        return "has-text-danger";
      }
    },

    ...mapState("notifications", ["notifications"])
  },

  methods: {
    remove(device: string) {
      this.$emit("remove-device", device);
    },

    toggle() {
      this.updating = true;
      if (this.device.status === "off") {
        this.on(this.device.device);
      } else if (this.device.status === "on") {
        this.off(this.device.device);
      }
    },

    ...mapActions("devices", ["on", "off"])
  }
});

export default DeviceWidget;
</script>
