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
                v-bind:key="device.device"
                v-bind:value="device.device"
              >
                {{ device.nickname || device.device }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button class="button is-info" v-on:click="select">
            <font-awesome-icon icon="plus" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const SelectDevice = Vue.extend({
  props: {
    label: String,
    devices: Array,
  },

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
