<template>
  <tr>
    <td class="has-text-centered" v-if="isMeter">
      <div class="tags has-addons">
        <span class="tag has-text-success has-background-dark">
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
          <select-device-type :devicetype="device.devicetype" />
        </div>

        <div class="control">
          <div class="tags has-addons">
            <a class="tag" :class="deviceOnClass" @click="on(device.device)">
              <font-awesome-icon icon="circle" />
            </a>
            <a class="tag" :class="deviceOffClass" @click="off(device.device)">
              <font-awesome-icon icon="circle" />
            </a>
            <a class="tag" :class="deviceDisconnectedClass">
              <font-awesome-icon icon="circle" />
            </a>
          </div>
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
import { Device } from "@/store/devices/types";
import { mapActions } from "vuex";
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
      editing: false
    };
  },

  components: {
    SelectDeviceType
  },

  computed: {
    deviceOnClass() {
      if (this.device.status === "on" || this.device.status === "1") {
        return "has-text-success has-background-dark";
      } else {
        return "has-text-success-light has-background-dark";
      }
    },
    deviceOffClass() {
      if (this.device.status === "off" || this.device.status === "0") {
        return "has-text-warning has-background-dark";
      } else {
        return "has-text-warning-light has-background-dark";
      }
    },
    deviceDisconnectedClass() {
      if (this.device.status === "disconnected") {
        return "has-text-danger has-background-dark";
      } else {
        return "has-text-danger-light has-background-dark";
      }
    },
    deviceIcon() {
      if (this.device.status === "on") {
        return "circle";
      } else if (this.device.status === "off") {
        return "circle";
      } else if (this.device.status === "disconnected") {
        return "times";
      }

      return null;
    },
    isMeter() {
      return this.device.devicetype === "meter";
    },
    linkName() {
      if (this.device.devicetype === "meter") {
        return "readings";
      } else {
        return "statuses";
      }
    },
    meterReadingHumidity() {
      return 100 * (this.device.humidity || 35);
    },
    meterReadingTemperature() {
      return this.units === "F"
        ? celsius2fahrenheit(this.device.temperature || 23)
        : this.device.temperature || 23;
    },
    switchStatus() {
      return this.device.status || "off";
    },
    unitsWithDegrees() {
      return "°" + this.units;
    }
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      this.edit({
        ...this.device,
        nickname: this.nickname
      });
      this.editing = false;
    },

    saveDeviceType(devicetype: string) {
      this.edit({
        ...this.device,
        devicetype: devicetype
      });
    },

    cancel() {
      this.nickname = this.device.nickname;
      this.editing = false;
    },

    trash() {
      if (confirm("You sure, bro?")) {
        this.remove(this.device);
      }
    },

    ...mapActions("devices", ["edit", "remove", "on", "off"])
  }
});

export default DeviceRow;
</script>
