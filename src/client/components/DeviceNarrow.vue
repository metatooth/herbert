<template>
  <nav class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <p class="subtitle is-7">
          <strong>{{ device.name.slice(0, 12) }}</strong
          ><br />
          {{ device.device }}
        </p>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <button class="button" :disabled="locked" @click="toggle">
          <font-awesome-icon :class="deviceClass" :icon="device.icon" />
          <span>{{ status.slice(0, 3) }}</span>
        </button>
      </div>
      <div class="level-item">
        <button class="button has-text-info" @click="history">
          <span class="icon">
            <font-awesome-icon icon="history" />
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

import { Device } from "@/store/meters/types";

const DeviceNarrow = Vue.extend({
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
    deviceClass() {
      let style;

      if (this.status === "disconnected") {
        style = "icon has-text-danger";
      } else if (this.status === "on") {
        style = "icon has-text-success";
      } else if (this.status === "off") {
        style = "icon has-text-warning";
      }

      return style;
    }
  },

  methods: {
    history() {
      this.$router.push({
        name: "statuses",
        params: {
          name: this.device.nickname,
          device: this.device.device
        }
      });
    },

    toggle() {
      if (this.status === "off") {
        this.status = "on";
        this.on(this.device.device);
      } else if (this.status === "on") {
        this.status = "off";
        this.off(this.device.device);
      }
    },

    ...mapActions("devices", ["on", "off"])
  }
});

export default DeviceNarrow;
</script>
