<template>
  <section class="section">
    <h2 class="title">{{ devicesCount }} {{ devicesName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Name</th>
          <th>History</th>
          <th>MAC</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <device-row
          v-for="device in devices"
          v-bind:key="device.device"
          v-bind:device="device"
          v-bind:units="units"
        />
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DeviceRow from "@/components/DeviceRow.vue";
import { mapGetters } from "vuex";

const Devices = Vue.extend({
  props: {
    units: String
  },

  components: {
    DeviceRow
  },

  computed: {
    ...mapGetters("devices", ["devices", "devicesCount"]),

    devicesName() {
      if (this.devicesCount === 1) {
        return "Device";
      } else {
        return "Devices";
      }
    }
  }
});

export default Devices;
</script>
