<template>
  <tr>
    <td class="has-text-centered" v-if="isMeter">
      <div class="tags has-addons">
        <span class="tag has-background-dark" :class="meterClass">
          <font-awesome-icon icon="tachometer-alt" />
        </span>
        <span class="tag has-text-light has-background-dark">
          {{ meterReadingTemperature.toFixed(1) }} {{ unitsWithDegrees }}
        </span>
        <span class="tag has-text-light has-background-dark">
          {{ meterReadingHumidity.toFixed(0) }} %
        </span>
      </div>
    </td>
    <td class="has-text-centered" v-else>
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
        <span v-if="device.nickname">{{ device.nickname }}</span>
        <span v-else>click to name</span>
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
      <router-link
        :to="{
          name: linkName,
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
import { celsius2fahrenheit } from "../../shared/utils";
import SelectDeviceType from "@/components/SelectDeviceType.vue";

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
    SelectDeviceType
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
      } else if (this.device.status === "disconnected") {
        return "times";
      }
      return null;
    },
    isMeter(): boolean {
      return this.device.devicetype === "meter";
    },
    linkName(): string {
      if (this.device.devicetype === "meter") {
        return "readings";
      }
      return "statuses";
    },
    meterClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.device.device;
      });
      if (found || this.device.status === "disconnected") {
        return "has-text-danger";
      }

      return "has-text-success";
    },
    meterReadingHumidity(): number {
      return 100 * (this.device.humidity || 35);
    },
    meterReadingTemperature(): number {
      return this.units === "F"
        ? celsius2fahrenheit(this.device.temperature || 23)
        : this.device.temperature || 23;
    },
    switchStatus(): string {
      return this.device.status || "off";
    },
    unitsWithDegrees(): string {
      return "°" + this.units;
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
