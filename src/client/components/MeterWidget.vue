<template>
  <div class="control">
    <div class="tags has-addons">
      <span class="tag is-medium">
        <font-awesome-icon icon="tachometer-alt" />
      </span>
      <span class="tag is-medium">
        {{ temperature.toFixed(1) }} {{ unitsWithDegrees }}
      </span>
      <span class="tag is-medium"> {{ humidity.toFixed(0) }} % </span>
      <span class="tag is-medium">
        {{ meter.nickname || meter.meter }}
      </span>
      <span class="tag is-medium is-delete" v-on:click="remove(meter.device)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Device, DeviceState } from "@/store/devices/types";
import { celsius2fahrenheit } from "../../shared/utils";

const MeterWidget = Vue.extend({
  props: {
    state: DeviceState,
    units: String
  },

  computed: {
    meter(): Device {
      return this.state.device;
    },

    temperature() {
      if (this.units === "F") {
        return celsius2fahrenheit(this.state.device.temperature || 0);
      } else {
        return this.state.device.temperature || 0;
      }
    },

    humidity() {
      return 100 * (this.state.device.humidity || 0);
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
