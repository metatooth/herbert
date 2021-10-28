<template>
  <tr>
    <td class="has-text-centered">
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-small" :class="deviceClass" @click="toggle">
            <span class="icon">
              <font-awesome-icon :icon="deviceIcon" />
            </span>
          </button>
        </div>

        <div class="control">
          <select-device-type
            :devicetype="device.devicetype"
            @select-devicetype="saveDeviceType"
          />
        </div>
      </div>
    </td>
    <td>
      <a @click="editable" v-if="!editing">
        {{ device.name }}
      </a>
      <div class="field is-grouped" v-else>
        <div class="control">
          <input
            class="input is-small"
            type="text"
            v-model="nickname"
            @keyup.esc="cancel"
          />
        </div>
        <div class="control">
          <button class="button is-small is-primary" @click="save">
            <font-awesome-icon icon="check" />
          </button>
        </div>
        <div class="control">
          <button class="button is-small is-danger" @click="cancel">
            <font-awesome-icon icon="times" />
          </button>
        </div>
      </div>
    </td>
    <td>
      <timestamp
        :timestamp="new Date(Date.parse(device.updatedat))"
        :readable="true"
      />
    </td>
    <td>
      <router-link
        :to="{
          name: 'statuses',
          params: { name: device.nickname, device: device.device }
        }"
      >
        &gt;&gt;&gt;
      </router-link>
    </td>
    <td>
      {{ device.device }}
    </td>
    <td>
      <div class="control">
        <button class="button is-small is-danger" @click="trash">
          <font-awesome-icon icon="trash" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { Device } from "@/store/devices/types";
import { Notification } from "@/store/notifications/types";
import SelectDeviceType from "@/components/SelectDeviceType.vue";
import Timestamp from "@/components/Timestamp.vue";

const DeviceRow = Vue.extend({
  props: {
    device: Device,
    units: String
  },

  data() {
    return {
      nickname: this.device.nickname,
      updating: false,
      editing: false
    };
  },

  components: {
    SelectDeviceType,
    Timestamp
  },

  watch: {
    device() {
      this.updating = false;
    }
  },

  computed: {
    deviceClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.device.device;
      });

      let style = "has-background-dark";

      if (found || this.device.status === "disconnected") {
        style = `has-text-danger ${style}`;
      } else if (this.device.status === "on" || this.device.status === "1") {
        style = `has-text-success ${style}`;
      } else if (this.device.status === "off" || this.device.status === "0") {
        style = `has-text-warning ${style}`;
      }

      if (this.updating) {
        style = `is-loading ${style}`;
      }

      return style;
    },

    deviceIcon(): string | null {
      if (this.device.status === "on") {
        return "circle";
      } else if (this.device.status === "off") {
        return "circle";
      }
      return "times";
    },

    ...mapState("notifications", ["notifications"])
  },

  methods: {
    editable(): void {
      this.editing = true;
    },

    save(): void {
      this.edit({
        ...this.device,
        nickname: this.nickname
      });
      this.editing = false;
    },

    saveDeviceType(devicetype: string): void {
      this.edit({
        ...this.device,
        devicetype: devicetype
      });
    },

    cancel() {
      this.nickname = this.device.nickname;
      this.editing = false;
    },

    toggle() {
      this.updating = true;
      if (this.device.status === "off") {
        this.on(this.device.device);
      } else if (this.device.status === "on") {
        this.off(this.device.device);
      }
    },

    trash() {
      if (confirm("OK to remove?")) {
        this.remove(this.device);
      }
    },

    ...mapActions("devices", ["edit", "remove", "on", "off"])
  }
});

export default DeviceRow;
</script>
