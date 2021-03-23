<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field has-addons">
        <div class="control">
          <div class="select">
            <select v-model="selected">
              <option
                v-for="devicetype in devicetypes"
                v-bind:key="devicetype"
                v-bind:value="devicetype"
              >
                {{ devicetype }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const SelectDeviceType = Vue.extend({
  props: {
    devicetype: String
  },

  data() {
    return {
      devicetypes: [
        "meter",
        "lamp",
        "blower",
        "humidifier",
        "heater",
        "dehumidifier",
        "fan"
      ],
      selected: this.devicetype
    };
  },

  watch: {
    selected(val) {
      this.$emit("select-device-type", val);
    }
  }
});

export default SelectDeviceType;
</script>
