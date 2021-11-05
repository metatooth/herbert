<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <div class="title">
        <zone-tag :zone="zone" />
      </div>
      <div class="content">
        <zone-actual :zone="zone" :units="settings.units" />
      </div>
      <div class="content">
        <button class="button" :class="statusClass" @click="toggle">
          <span class="icon">
            <font-awesome-icon :icon="statusIcon" />
          </span>
        </button>
        &nbsp;
        <device-tag
          v-for="device in sorted"
          :key="device.device"
          :device="device"
        />
      </div>
      <div class="content is-italic">
        Updated <readable :timestamp="lastupdate" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";

import DeviceTag from "@/components/DeviceTag.vue";
import Readable from "@/components/Readable.vue";
import ZoneActual from "@/components/ZoneActual.vue";
import ZoneTag from "@/components/ZoneTag.vue";
import { Device } from "@/store/devices/types";
import { Zone } from "@/store/zones/types";

const ZoneTile = Vue.extend({
  props: {
    zone: Zone
  },

  data() {
    return {
      readable: true,
      editable: false
    };
  },

  components: {
    DeviceTag,
    Readable,
    ZoneActual,
    ZoneTag
  },

  computed: {
    lastupdate() {
      let last = null;
      this.zone.meters.forEach(meter => {
        const updatedat = new Date(meter.updatedat);
        if (last === null || updatedat > last) {
          last = updatedat;
        }
      });
      return last;
    },

    statusClass() {
      if (this.zone.active) {
        return "has-text-success";
      } else {
        return "has-text-info";
      }
    },

    statusIcon() {
      if (this.zone.active) {
        return "toggle-on";
      } else {
        return "toggle-off";
      }
    },

    sorted(): Device[] {
      const devices = [];
      this.zone.devices.forEach(d => {
        devices.push(Object.assign(new Device(), d));
      });
      devices.sort((a, b) => {
        return a.devicetype > b.devicetype;
      });
      return devices;
    },

    ...mapGetters("settings", ["settings"])
  },

  methods: {
    toggle() {
      const zone = {
        ...this.zone,
        active: !this.zone.active
      };

      this.edit(zone);
    },

    ...mapActions("zones", ["edit"])
  }
});

export default ZoneTile;
</script>
