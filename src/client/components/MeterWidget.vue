<template>
  <div class="control">
    <div class="tags has-addons">
      <span class="tag is-medium has-text-success has-background-dark">
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
import { Device } from "@/store/devices/types";
import { celsius2fahrenheit } from "../../shared/utils";

const MeterWidget = Vue.extend({
  props: {
    device: Device,
    units: String
  },

  computed: {
    temperature() {
      if (this.units === "F") {
        return celsius2fahrenheit(this.device.temperature || 23);
      } else {
        return this.device.temperature || 23;
      }
    },

    humidity() {
      return 100 * (this.device.humidity || 35);
    },

    linkName() {
      return this.device.nickname || this.device.device;
    },

    unitsWithDegrees() {
      return "°" + this.units;
    }
  },

  methods: {
    remove(meter: string) {
      this.$emit("remove-device", meter);
    }
  }
});

export default MeterWidget;
</script>
