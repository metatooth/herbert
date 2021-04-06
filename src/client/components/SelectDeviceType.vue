<template>
  <div class="control has-icons-left">
    <div class="select is-small">
      <select v-model="selected">
        <option
          v-for="type in devicetypes"
          v-bind:key="type"
          v-bind:value="type"
        >
          {{ type }}
        </option>
      </select>
    </div>
    <span class="icon is-small is-left">
      <font-awesome-icon :icon="selectedIcon" />
    </span>
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
    selected(val: string) {
      console.log("selected", val, this.selected);
      this.$emit("select-devicetype", val);
    }
  },

  computed: {
    selectedIcon() {
      if (this.selected === "lamp") {
        return "lightbulb";
      } else if (this.selected === "blower") {
        return "wind";
      } else if (this.selected === "dehumidifier") {
        return "tint-slash";
      } else if (this.selected === "heater") {
        return "fire-alt";
      } else if (this.selected === "humidifier") {
        return "tint";
      } else if (this.selected === "fan") {
        return "fan";
      }

      return "circle";
    }
  }
});

export default SelectDeviceType;
</script>
