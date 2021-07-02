 <template>
  <section class="sectioon">
    <div class="level">
      <span class="title">{{ devicesCount }} {{ devicesName }}</span>
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
  components: {
    DeviceTile
  },

  computed: {
    ...mapGetters("devices", ["devices", "devicesCount"]),
    ...mapGetters("settings", ["settings"]),

    devicesName() {
      if (this.devicesCount === 1) {
        return "Device";
      } else {
        return "Devices";
      }
    },

    left() {
      const devices = [];
      for (let i = 0; i < this.devicesCount; i = i + 3) {
        if (this.devices[i]) {
          devices.push(this.devices[i]);
        }
      }
      return devices;
    },

    middle() {
      const devices = [];
      for (let i = 1; i < this.devicesCount; i = i + 3) {
        if (this.devices[i]) {
          devices.push(this.devices[i]);
        }
      }
      return devices;
    },
    
    right() {
      const devices = [];
      for (let i = 2; i < this.devicesCount; i = i + 3) {
        if (this.devices[i]) {
          devices.push(this.devices[i]);
        }
      }
      return devices;
    }
  }
});

export default Devices;
</script>
