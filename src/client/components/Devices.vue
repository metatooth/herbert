<template>
  <section class="sectioon">
    <div class="level">
      <span class="title">{{ activeCount }} {{ devicesName }}</span>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical">
        <device-tile
          v-for="device in left"
          :key="device.device"
          :device="device"
        />
      </div>
      <div class="tile is-4 is-vertical">
        <device-tile
          v-for="device in middle"
          :key="device.device"
          :device="device"
        />
      </div>
      <div class="tile is-4 is-vertical">
        <device-tile
          v-for="device in right"
          :key="device.device"
          :device="device"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DeviceTile from "@/components/DeviceTile.vue";
import { mapGetters } from "vuex";

const Devices = Vue.extend({
  props: {
    filter: String
  },

  components: {
    DeviceTile
  },

  computed: {
    ...mapGetters("devices", ["devices"]),

    activeSet() {
      return this.devices.filter(el => {
        if (el.nickname) {
          if (el.nickname.match(this.filter)) {
            return true;
          }
        }

        return el.device.match(this.filter);
      });
    },

    activeCount() {
      return this.activeSet.length;
    },

    devicesName() {
      if (this.activeCount === 1) {
        return "Device";
      } else {
        return "Devices";
      }
    },

    left() {
      const devices = [];
      for (let i = 0; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          devices.push(this.activeSet[i]);
        }
      }
      return devices;
    },

    middle() {
      const devices = [];
      for (let i = 1; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          devices.push(this.activeSet[i]);
        }
      }
      return devices;
    },

    right() {
      const devices = [];
      for (let i = 2; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          devices.push(this.activeSet[i]);
        }
      }
      return devices;
    }
  }
});

export default Devices;
</script>
