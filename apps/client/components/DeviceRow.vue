<script lang="ts">
import { mapActions, mapGetters, mapState } from "vuex";

import EditControls from "@client/components/EditControls.vue";
import Readable from "@client/components/Readable.vue";
import SelectDeviceType from "@client/components/SelectDeviceType.vue";
import { Device } from "@client/store/devices/types";
import { Notification } from "@client/store/notifications/types";

export default {
  components: {
    EditControls,
    SelectDeviceType,
    Readable,
  },

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
};
</script>

<template>
  <tr>
    <td>
      <span v-if="!editing">
        {{ device.name }}
      </span>
      <div v-else class="control">
        <input
          v-model="nickname"
          class="input"
          type="text"
          @keyup.esc="cancel"
        />
      </div>
    </td>
    <td>
      {{ zonename }}
    </td>
    <td>
      <button v-if="!editing" class="button" :disabled="locked" @click="toggle">
        <font-awesome-icon :class="deviceClass" :icon="device.icon" />
        <span>{{ device.devicetype }}</span>
      </button>
      <div v-else class="control">
        <select-device-type
          :devicetype="device.devicetype"
          @select-devicetype="saveDeviceType"
        />
      </div>
    </td>
    <td class="is-italic">
      <router-link
        :to="{
          name: 'statuses',
          params: { name: device.nickname, device: device.device },
        }"
      >
        <readable :timestamp="device.updatedat" />
      </router-link>
    </td>
    <td>
      {{ device.device }}
    </td>
    <td>
      <edit-controls
        v-if="!locked"
        @on-edit="editable"
        @on-save="save"
        @on-destroy="destroy"
        @on-cancel="cancel"
      />
    </td>
  </tr>
</template>
