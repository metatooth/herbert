<template>
  <section class="section">
    <h2 class="title">{{ devices.length }} {{ devicesName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>MAC</th>
          <th>Nickname</th>
          <th>Type</th>
          <th>Manufacturer</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        <device-row
          v-for="device in devices"
          v-bind:key="device.device"
          v-bind:device="device"
        />
      </tbody>
    </table>
    <button class="button is-info">
      <font-awesome-icon icon="sync" @click="$store.dispatch('getDevices')" />
    </button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DeviceRow from "@/components/DeviceRow.vue";

const Devices = Vue.extend({
  props: {
    devices: Array
  },

  components: {
    DeviceRow
  },

  computed: {
    devicesName() {
      if (this.devices.length === 1) {
        return "Device";
      } else {
        return "Devices";
      }
    }
  }
});

export default Devices;
</script>
