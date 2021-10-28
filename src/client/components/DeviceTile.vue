<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <div class="title">
        <span v-if="editing">
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
          </div>
          <div class="control">
            <select-device-type
              :devicetype="device.devicetype"
              @select-devicetype="selected"
            />
          </div>
        </span>

        <span v-else>{{ device.name }}</span>
      </div>
      <p class="subtitle">
        {{ device.device }}
      </p>
      <div class="content">
        <button class="button" @click="toggle">
          <font-awesome-icon :class="deviceClass" :icon="deviceIcon" />
          <span>{{ status }}</span>
        </button>
      </div>
      <div class="content">
        <timestamp
          :timestamp="new Date(Date.parse(device.updatedat))"
          :readable="true"
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
import { Notification } from "@/store/notifications/types";
import Timestamp from "@/components/Timestamp.vue";
import EditControls from "@/components/EditControls.vue";
import SelectDeviceType from "@/components/SelectDeviceType.vue";

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
    Timestamp
  },

  computed: {
    deviceClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.device.device;
      });

      let style;

      if (found || this.status === "disconnected") {
        style = "icon has-text-danger";
      } else if (this.status === "on") {
        style = "icon has-text-success";
      } else if (this.status === "off") {
        style = "icon has-text-warning";
      }

      return style;
    },

    deviceIcon() {
      if (this.status !== "on" && this.status !== "off") {
        return "times";
      }

      if (this.device.devicetype === "heater") {
        return "fire-alt";
      } else if (this.device.devicetype === "humidifier") {
        return "tint";
      } else if (this.device.devicetype === "dehumidifier") {
        return "tint-slash";
      } else if (this.device.devicetype === "lamp") {
        return "lightbulb";
      } else if (this.device.devicetype === "blower") {
        return "wind";
      } else if (this.device.devicetype === "cooler") {
        return "snowflake";
      } else if (this.device.devicetype === "irrigator") {
        return "cloud-rain";
      } else if (this.device.devicetype === "fan") {
        return "fan";
      }

      return "circle";
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
    ...mapGetters("notifications", ["notifications"]),
    ...mapGetters("settings", ["settings"])
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

    selected(type: string) {
      this.devicetype = type;
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

    ...mapActions("devices", ["on", "off", "edit", "remove"])
  }
});

export default DeviceTile;
</script>
