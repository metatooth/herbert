<template>
  <tr>
    <td>
      {{ device.device }}
    </td>
    <td class="has-text-centered">
      <div
        v-if="meterReadingTemperature"
        class="field is-grouped is-grouped-multiline"
      >
        <target
          icon="thermometer-half"
          v-bind:value="meterReadingTemperature"
          :precision="1"
          :units="unitsWithDegrees"
          text="warning"
          background="warning"
        />
        <target
          icon="tint"
          v-bind:value="meterReadingHumidity"
          :precision="0"
          units="%"
          text="info"
          background="info"
        />
      </div>
      <div v-else class="tags has-addons">
        <span class="tag is-medium" :class="deviceOnClass">
          <font-awesome-icon icon="circle" />
        </span>
        <span class="tag is-medium" :class="deviceOffClass">
          <font-awesome-icon icon="circle" />
        </span>
        <span class="tag is-medium" :class="deviceDisconnectedClass">
          <font-awesome-icon icon="circle" />
        </span>
      </div>
    </td>
    <td>
      <select-device-type
        v-bind:devicetype="device.devicetype"
        @select-device-type="saveDeviceType"
      />
    </td>
    <td>
      <a @click="editable" v-if="!editing">
        <span v-if="device.nickname">{{ device.nickname }}</span>
        <span v-else>click to name</span>
      </a>
      <div class="field is-grouped" v-else>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="nickname"
            @keyup.esc="cancel"
          />
        </div>
        <div class="control">
          <button class="button is-primary" @click="save">
            <font-awesome-icon icon="check" />
          </button>
        </div>
        <div class="control">
          <button class="button is-danger" @click="cancel">
            <font-awesome-icon icon="times" />
          </button>
        </div>
      </div>
    </td>
    <td>
      <timestamp v-bind:timestamp="new Date(Date.parse(device.timestamp))" />
    </td>
    <td>
      {{ device.manufacturer }}
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
  </tr>
</template>

<script lang="ts">
import SelectDeviceType from "@/components/SelectDeviceType.vue";
import Timestamp from "@/components/Timestamp.vue";
import Vue from "vue";
import { Device } from "@/store/devices/types";
import { mapActions } from "vuex";
import Target from "@/components/Target.vue";
import { celsius2fahrenheit } from "../../shared/utils";

const DeviceRow = Vue.extend({
  props: {
    device: Device,
    units: String
  },

  components: {
    SelectDeviceType,
    Timestamp,
    Target
  },

  data() {
    return {
      nickname: this.device.nickname,
      editing: false
    };
  },

  computed: {
    deviceOnClass() {
      console.log("device row on?", this.device);
      if (this.device.status === "on" || this.device.status === "1") {
        return "has-text-success has-background-black";
      } else {
        return "has-text-success-light has-background-black";
      }
    },
    deviceOffClass() {
      if (this.device.status === "off" || this.device.status === "0") {
        return "has-text-warning has-background-black";
      } else {
        return "has-text-warning-light has-background-black";
      }
    },
    deviceDisconnectedClass() {
      if (this.device.status === "disconnected") {
        return "has-text-danger has-background-black";
      } else {
        return "has-text-danger-light has-background-black";
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
    linkName() {
      if (this.device.devicetype === "meter") {
        return "readings";
      } else {
        return "statuses";
      }
    },
    meterReadingHumidity() {
      return 100 * parseFloat(this.device.humidity);
    },
    meterReadingTemperature() {
      return this.units === "F"
        ? celsius2fahrenheit(this.device.temperature)
        : parseFloat(this.device.temperature);
    },
    unitsWithDegrees() {
      return "" + this.units;
    },
    updated() {
      return new Date(Date.parse(this.device.updatedat));
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

    ...mapActions("devices", ["edit"])
  }
});

export default DeviceRow;
</script>
