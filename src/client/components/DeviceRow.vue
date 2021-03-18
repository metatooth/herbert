<template>
  <tr>
    <td>
      {{ device.device }}
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
      <select-device-type
        v-bind:devicetype="device.devicetype"
        @select-device-type="saveDeviceType"
      />
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
    <td>
      <timestamp :timestamp="new Date(Date.parse(device.updatedat))" />
    </td>
  </tr>
</template>

<script lang="ts">
import SelectDeviceType from "@/components/SelectDeviceType.vue";
import Timestamp from "@/components/Timestamp.vue";
import Vue from "vue";
import { Device } from "@/store/devices/types";
import { mapActions } from "vuex";

const DeviceRow = Vue.extend({
  props: {
    device: Device
  },

  components: {
    SelectDeviceType,
    Timestamp
  },

  data() {
    return {
      nickname: this.device.nickname,
      editing: false
    };
  },

  computed: {
    linkName() {
      if (this.device.devicetype === "meter") {
        return "readings";
      } else {
        return "statuses";
      }
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
