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
import { Device } from "@/store/devices/types";
import { celsius2fahrenheit } from "../../shared/utils";

const MeterWidget = Vue.extend({
  props: {
    meter: Device,
    units: String
  },

  computed: {
    temperature() {
      if (this.units === "F") {
        return celsius2fahrenheit(this.meter.temperature);
      } else {
        return parseFloat(this.meter.temperature);
      }
    },

    humidity() {
      return 100 * this.meter.humidity;
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