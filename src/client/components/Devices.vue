<template>
  <section class="section">
    <h2 class="title">{{ devicesCount }} {{ devicesName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>MAC</th>
          <th>Status</th>
          <th>Type</th>
          <th>Nickname</th>
          <th>Updated</th>
          <th>Manufacturer</th>
          <th>History</th>
        </tr>
      </thead>
      <tbody>
        <device-row
          v-for="dstate in devices"
          v-bind:key="dstate.device.device"
          v-bind:device="dstate.device"
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
