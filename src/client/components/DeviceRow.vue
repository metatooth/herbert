<template>
  <tr>
    <td>
      <span v-if="!editing">
        <div class="is-size-3">{{ device.name }}</div>
        <div class="is-size-5">{{ device.device }}</div>
        <div class="is-size-7">
          <em
            ><readable :timestamp="new Date(Date.parse(device.updatedat))"
          /></em>
        </div>
      </span>
      <div class="control" v-else>
        <input
          class="input"
          type="text"
          v-model="nickname"
          @keyup.esc="cancel"
        />
      </div>
    </td>
    <td>
      {{ zonename }}
    </td>
    <td>
      <device-actual
        v-if="!editing"
        :device="device"
        :locked="locked"
        @on-toggle="toggle"
      />
      <div class="control" v-else>
        <select-device-type
          :devicetype="device.devicetype"
          @select-devicetype="saveDeviceType"
        />
      </div>
    </td>
    <td>
      <edit-controls
        v-if="!locked"
        @on-edit="editable"
        @on-save="save"
        @on-destroy="destroy"
        @on-cancel="cancel"
        :stacked="true"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { Device } from "@/store/devices/types";
import { Notification } from "@/store/notifications/types";
import SelectDeviceType from "@/components/SelectDeviceType.vue";
import Readable from "@/components/Readable.vue";
import EditControls from "@/components/EditControls.vue";
import DeviceActual from "@/components/DeviceActual.vue";

const DeviceRow = Vue.extend({
  props: {
    device: Device,
    locked: Boolean,
    units: String,
  },

  data() {
    return {
      nickname: this.device.nickname,
      editing: false,
      status: this.device.status,
    };
  },

  components: {
    DeviceActual,
    EditControls,
    SelectDeviceType,
    Readable,
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

    iconClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.device.device;
      });

      let style = "tag is-medium has-background-black-bis";

      if (found || this.device.status === "disconnected") {
        style = `has-text-danger ${style}`;
      } else if (this.device.status === "on" || this.device.status === "1") {
        style = `has-text-success ${style}`;
      } else if (this.device.status === "off" || this.device.status === "0") {
        style = `has-text-warning ${style}`;
      }

      return style;
    },

    labelClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.device.device;
      });

      let style = "tag is-medium has-text-black-bis";

      if (found || this.device.status === "disconnected") {
        style = `has-background-danger ${style}`;
      } else if (this.device.status === "on" || this.device.status === "1") {
        style = `has-background-success ${style}`;
      } else if (this.device.status === "off" || this.device.status === "0") {
        style = `has-background-warning ${style}`;
      }

      return style;
    },

    zone() {
      const found = this.zones.filter((zone) => {
        const devices = zone.devices.filter((device) => {
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

    ...mapState("notifications", ["notifications"]),
    ...mapGetters("zones", ["zones"]),
  },

  methods: {
    editable(): void {
      this.editing = true;
    },

    save(): void {
      this.edit({
        ...this.device,
        nickname: this.nickname,
      });
      this.editing = false;
    },

    saveDeviceType(devicetype: string): void {
      this.edit({
        ...this.device,
        devicetype: devicetype,
      });
    },

    cancel() {
      this.nickname = this.device.nickname;
      this.editing = false;
    },

    toggle() {
      if (this.status === "off") {
        this.on(this.device.device);
        this.status = "on";
      } else if (this.status === "on") {
        this.off(this.device.device);
        this.status = "off";
      }
    },

    destroy() {
      if (confirm("OK to remove?")) {
        this.remove(this.device);
      }
    },

    ...mapActions("devices", ["edit", "remove", "on", "off"]),
  },
});

export default DeviceRow;
</script>
