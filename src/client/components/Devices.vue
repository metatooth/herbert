<template>
  <section class="section">
    <h2 class="title">{{ devicesCount }} {{ devicesName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>MAC</th>
          <th>Nickname</th>
          <th>Type</th>
          <th>Manufacturer</th>
          <th>History</th>
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
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DeviceRow from "@/components/DeviceRow.vue";
import { mapState, mapGetters } from "vuex";

const Devices = Vue.extend({
  components: {
    DeviceRow
  },

  computed: {
    ...mapState("devices", ["devices"]),

    ...mapGetters("devices", ["devicesCount"]),

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
