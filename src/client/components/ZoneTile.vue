<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">
        <span>
          <router-link
            :to="{
              name: 'zone',
              hash: linkto,
              params: { id: zone.id }
            }"
          >
            {{ zone.nickname }}
          </router-link>
        </span>
      </p>
      <div class="content">
        <div cqlass="control">
          <div class="tags has-addons">
            <span class="tag has-background-black-bis is-medium" :style="text">
              <font-awesome-icon icon="lightbulb" />
            </span>
            <span class="tag has-text-black-bis is-medium" :style="background">
              {{ zone.profile.profile }}
            </span>
          </div>
        </div>
      </div>
      <div class="content">
        <zone-actual :zone="zone" :units="settings.units" />
      </div>
      <div class="content">
        <device-tag
          v-for="device in sorted"
          :key="device.device"
          :device="device"
        />
      </div>
      <div class="content">
        <button class="button" :class="statusClass" @click="toggle">
          <span class="icon">
            <font-awesome-icon :icon="statusIcon" />
          </span>
        </button>
      </div>
      <div class="content">
        <timestamp :timestamp="lastupdate" :readable="readable" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { Device } from "@/store/devices/types";
import { Zone } from "@/store/zones/types";
import ZoneActual from "@/components/ZoneActual.vue";
import Timestamp from "@/components/Timestamp.vue";
import DeviceTag from "@/components/DeviceTag.vue";

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
    Timestamp,
    ZoneActual
  },

  computed: {
    background() {
      if (this.zone.isDay(new Date())) {
        return "background-color: #ffe08a";
      } else {
        return "background-color: #7a7a7a";
      }
    },

    linkto(): string {
      return `#zone-details-${this.zone.id}`;
    },

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

    text() {
      if (this.zone.isDay(new Date())) {
        return "color: #ffe08a";
      } else {
        return "color: #7a7a7a";
      }
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
