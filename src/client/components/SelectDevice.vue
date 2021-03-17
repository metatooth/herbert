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
                v-for="ds in devices"
                v-bind:key="ds.device.device"
                v-bind:value="ds.device.device"
              >
                {{ ds.device.nickname || ds.device.device }}
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
import { mapState } from "vuex";

const SelectDevice = Vue.extend({
  props: {
    label: String
  },

  data() {
    return {
      selected: ""
    };
  },

  computed: {
    ...mapState(["devices/devices"])
  },

  methods: {
    select() {
      this.$emit("select-device", this.selected);
      this.selected = "";
    }
  }
});

export default SelectDevice;
</script>
