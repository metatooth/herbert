<template>
  <div class="control">
    <div class="tags has-addons">
      <span class="tag is-medium has-background-dark" :class="meterClass">
        <font-awesome-icon icon="tachometer-alt" />
      </span>
      <span class="tag is-medium has-text-light has-background-dark">
        {{ temperature.toFixed(1) }} {{ unitsWithDegrees }}
      </span>
      <span class="tag is-medium has-text-light has-background-dark">
        {{ humidity.toFixed(0) }} %
      </span>
      <span class="tag is-medium has-text-light has-background-dark">
        <router-link
          :to="{
            name: 'readings',
            params: { name: device.nickname, device: device.device }
          }"
        >
          &gt;&gt;&gt;
        </router-link>
      </span>
      <span class="tag is-medium has-text-light has-background-dark">
        {{ linkName }}
        <button class="delete" v-on:click="remove(device.device)" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { Device } from "@/store/devices/types";
import { Notification } from "@/store/notifications/types";
import { celsius2fahrenheit } from "../../shared/utils";

const MeterWidget = Vue.extend({
  props: {
    device: Device,
    units: String
  },

  computed: {
    temperature(): number {
      if (this.units === "F") {
        return celsius2fahrenheit(this.device.temperature || 23);
      } else {
        return this.device.temperature || 23;
      }
    },

    humidity(): number {
      return 100 * (this.device.humidity || 35);
    },

    linkName(): string {
      return this.device.nickname || this.device.device;
    },

    meterClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.device.device;
      });

      if (found || this.device.status === "disconnected") {
        return "has-text-danger";
      } else {
        return "has-text-success";
      }
    },

    unitsWithDegrees() {
      return "°" + this.units;
    },

    ...mapState("notifications", ["notifications"])
  },

  methods: {
    remove(meter: string) {
      this.$emit("remove-device", meter);
    }
  }
});

export default MeterWidget;
</script>
