<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <div class="title">
        <div v-if="editing">
          <div class="field is-grouped is-grouped-multiline">
            <div class="control">
              <input
                class="input"
                type="text"
                placeHolder="Name this device"
                v-model="nickname"
                @keyup.esc="cancel"
              />
            </div>
            <div class="control">
              <select-device-type
                :devicetype="device.devicetype"
                @select-devicetype="selectdevicetype"
              />
            </div>
            <div class="control">
              <select-zone-for-device
                :zoneid="zoneid"
                @select-zone="selectzone"
              />
            </div>
          </div>
        </div>
        <span v-else>{{ device.name }}</span>
      </div>
      <p class="subtitle">
        {{ device.device }}
      </p>
      <p class="subtitle">
        {{ zonename }}
      </p>
      <div class="content">
        <button class="button" @click="toggle">
          <font-awesome-icon :class="deviceClass" :icon="device.icon" />
          <span>{{ status }}</span>
        </button>
      </div>
      <div class="content">
        <readable
          class="is-italic"
          :timestamp="new Date(Date.parse(device.updatedat))"
        />
        <router-link
          :to="{
            name: 'statuses',
            params: { name: device.nickname, device: device.device }
          }"
        >
          &gt;&gt;&gt;
        </router-link>
      </div>
      <div class="content">
        <edit-controls
          class="edit-controls"
          @on-edit="editable"
          @on-save="save"
          @on-destroy="destroy"
          @on-cancel="cancel"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { Device } from "@/store/devices/types";
import Readable from "@/components/Readable.vue";
import EditControls from "@/components/EditControls.vue";
import SelectDeviceType from "@/components/SelectDeviceType.vue";
import SelectZoneForDevice from "@/components/SelectZoneForDevice.vue";

const DeviceTile = Vue.extend({
  props: {
    device: Device
  },

  data() {
    return {
      nickname: this.device.nickname,
      devicetype: this.device.devicetype,
      status: this.device.status,
      readable: true,
      editing: false
    };
  },

  components: {
    EditControls,
    SelectDeviceType,
    SelectZoneForDevice,
    Readable
  },

  computed: {
    deviceClass(): string {
      let style;

      if (this.status === "disconnected") {
        style = "icon has-text-danger";
      } else if (this.status === "on") {
        style = "icon has-text-success";
      } else if (this.status === "off") {
        style = "icon has-text-warning";
      }

      return style;
    },

    statusClass() {
      if (this.status === "on") {
        return "has-text-success";
      } else {
        return "has-text-info";
      }
    },

    statusIcon() {
      if (this.status === "on") {
        return "toggle-on";
      } else {
        return "toggle-off";
      }
    },

    zone() {
      const found = this.zones.filter(zone => {
        const devices = zone.devices.filter(device => {
          return this.device.device === device.device;
        });
        return devices.length !== 0;
      });

      return found.length !== 0 ? found[0] : null;
    },

    zoneid() {
      const zone = this.zone;
      if (zone) {
        return zone.id;
      }
      return 0;
    },

    zonename() {
      const zone = this.zone;
      if (zone) {
        return zone.nickname;
      }
      return "";
    },

    ...mapGetters("settings", ["settings"]),
    ...mapGetters("zones", ["zones"])
  },

  methods: {
    toggle() {
      this.updating = true;
      if (this.status === "off") {
        this.status = "on";
        this.on(this.device.device);
      } else if (this.status === "on") {
        this.status = "off";
        this.off(this.device.device);
      }
    },

    editable() {
      this.editing = true;
    },

    save() {
      this.edit({
        ...this.device,
        nickname: this.nickname,
        devicetype: this.devicetype
      });
      this.editing = false;
    },

    selectdevicetype(type: string) {
      this.devicetype = type;
    },

    selectzone(zone: number) {
      const target = this.zones.filter(z => {
        return zone === z.id;
      });

      const payload = { zone: target[0], device: this.device.device };
      this.zones.forEach(zone => {
        zone.devices.forEach(device => {
          if (device.device === this.device.device) {
            this.removeDevice(payload);
          }
        });

        if (payload.zone.id === zone.id) {
          this.addDevice(payload);
        }
      });
    },

    destroy() {
      if (confirm("OK to remove?")) {
        this.remove(this.device);
      }
    },

    cancel() {
      this.nickname = this.device.nickname;
      this.devicetype = this.device.devicetype;
      this.editing = false;
    },

    ...mapActions("devices", ["on", "off", "edit", "remove"]),
    ...mapActions("zones", ["addDevice", "removeDevice"])
  }
});

export default DeviceTile;
</script>
