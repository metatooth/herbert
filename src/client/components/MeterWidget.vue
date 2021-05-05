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
            params: { name: meter.nickname, device: meter.device }
          }"
        >
          &gt;&gt;&gt;
        </router-link>
      </span>
      <span class="tag is-medium has-text-light has-background-dark">
        {{ linkName }}
        <button class="delete" v-on:click="remove(meter.device)" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { Meter } from "@/store/meters/types";
import { Notification } from "@/store/notifications/types";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";

const MeterWidget = Vue.extend({
  props: {
    meter: Meter,
    units: String
  },

  computed: {
    temperature(): number {
      if (this.units === "C") {
        return this.meter.temperature;
      } else if (this.units === "F") {
        return celsius2fahrenheit(this.meter.temperature);
      } else {
        return celsius2kelvin(this.meter.temperature);
      }
    },

    humidity(): number {
      return 100 * this.meter.humidity;
    },

    linkName(): string {
      return this.meter.nickname || this.meter.device;
    },

    meterClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.meter.device;
      });

      if (found) {
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
