<template>
  <tr>
    <td>
      {{ device.device }}
    </td>
    <td>
      <a @click="edit" v-if="!editing">
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
      {{ device.devicetype }}
    </td>
    <td>
      {{ device.manufacturer }}
    </td>
    <td>
      <timestamp :timestamp="new Date(Date.parse(device.updatedat))" />
    </td>
    <td>
      <router-link
        :to="{
          name: 'readings',
          params: { name: device.nickname, meter: device.device }
        }"
        v-if="isMeter"
      >
        &gt;&gt;&gt;
      </router-link>
      <router-link
        :to="{
          name: 'statuses',
          params: { name: device.nickname, device: device.device }
        }"
        v-if="isSwitch"
      >
        &gt;&gt;&gt;
      </router-link>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";

import Timestamp from "@/components/Timestamp.vue";

const DeviceRow = Vue.extend({
  props: {
    device: Object
  },

  components: {
    Timestamp
  },

  data() {
    return {
      nickname: this.device.nickname,
      editing: false
    };
  },

  computed: {
    isMeter() {
      return this.device.devicetype === "meter";
    },

    isSwitch() {
      return this.device.devicetype !== "meter";
    }
  },

  methods: {
    edit() {
      this.editing = true;
    },

    save() {
      this.$store.dispatch("editDevice", {
        ...this.device,
        nickname: this.nickname
      });
      this.editing = false;
    },

    cancel() {
      this.nickname = this.device.nickname;
      this.editing = false;
    }
  }
});

export default DeviceRow;
</script>
