<script lang="ts">
import Vue from "vue";

const SelectDevice = Vue.extend({
  props: {
    label: string,
    devices: { type: Array<object>, default: [] }
  },

  emits: ["select-device"],

  data() {
    return {
      selected: "",
    };
  },

  methods: {
    select() {
      this.$emit("select-device", this.selected);
      this.selected = "";
    },
  },
});

export default SelectDevice;
</script>

<template>
  <div class="field is-horizontal">
    <div class="field-label">
      <label class="label">{{ label }}</label>
    </div>
    <div class="field-body">
      <div class="field has-addons">
        <div class="control">
          <div class="select">
            <select v-model="selected">
              <option
                v-for="device in devices"
                :key="device.device"
                :value="device.device"
              >
                {{ device.nickname || device.device }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button class="button is-info" @click="select">
            <font-awesome-icon icon="plus" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
