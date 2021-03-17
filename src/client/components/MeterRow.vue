<template>
  <tr>
    <td>
      {{ state.device.device }}
    </td>
    <td>
      <a @click="edit" v-if="!editing">
        <span v-if="state.device.nickname">{{ state.device.nickname }}</span>
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
        v-bind:devicetype="state.device.devicetype"
        @select-device-type="saveDeviceType"
      />
    </td>
    <td>
      {{ state.device.manufacturer }}
    </td>
    <td>
      <router-link
        :to="{
          name: 'readings',
          params: { name: state.device.nickname, meter: state.device.device }
        }"
      >
        &gt;&gt;&gt;
      </router-link>
    </td>
    <td>
      <timestamp :timestamp="new Date(Date.parse(state.device.updatedat))" />
    </td>
  </tr>
</template>

<script lang="ts">
import SelectDeviceType from "@/components/SelectDeviceType.vue";
import Timestamp from "@/components/Timestamp.vue";
import Vue from "vue";
import { mapState, mapGetters, mapActions } from "vuex";
import { DeviceState } from "@/store/devices/types";

const MeterRow = Vue.extend({
  props: {
    state: DeviceState
  },

  components: {
    SelectDeviceType,
    Timestamp
  },

  data() {
    return {
      nickname: this.state.device.nickname,
      editing: false
    };
  },

  methods: {
    destroy() {
      this.$store.dispatch("removeDevice", this.state.device);
    },

    edit() {
      this.editing = true;
    },

    save() {
      this.$store.dispatch("editDevice", {
        ...this.state.device,
        nickname: this.nickname
      });
      this.editing = false;
    },

    saveDeviceType(devicetype: string) {
      this.$store.dispatch("editDevice", {
        ...this.state.device,
        devicetype: devicetype
      });
    },

    cancel() {
      this.nickname = this.state.device.nickname;
      this.editing = false;
    }
  }
});

export default MeterRow;
</script>
