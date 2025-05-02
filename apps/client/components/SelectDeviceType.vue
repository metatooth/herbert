<script lang="ts">
export default {
  props: {
    devicetype: String,
  },

  emits: ["select-devicetype"],

  data() {
    return {
      devicetypes: [
        "cooler",
        "dehumidifier",
        "fan",
        "heater",
        "humidifier",
        "irrigator",
        "lamp",
      ],
      selected: this.devicetype,
    };
  },

  computed: {
    selectedIcon() {
      if (this.selected === "lamp") {
        return "lightbulb";
      } else if (this.selected === "blower") {
        return "wind";
      } else if (this.selected === "cooler") {
        return "snowflake";
      } else if (this.selected === "dehumidifier") {
        return "tint-slash";
      } else if (this.selected === "heater") {
        return "fire-alt";
      } else if (this.selected === "humidifier") {
        return "tint";
      } else if (this.selected === "irrigator") {
        return "cloud-rain";
      } else if (this.selected === "fan") {
        return "fan";
      }

      return "circle";
    },
  },

  watch: {
    selected(val: string) {
      this.$emit("select-devicetype", val);
    },
  },
};
</script>

<template>
  <div class="control has-icons-left">
    <div class="select">
      <select v-model="selected">
        <option value="">undefined</option>
        <option v-for="type in devicetypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>
    <span class="icon is-small is-left">
      <font-awesome-icon :icon="selectedIcon" />
    </span>
  </div>
</template>
