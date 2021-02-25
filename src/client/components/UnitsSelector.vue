<template>
  <form class="control">
    <label for="celsius" class="radio">
      <input id="celsius" v-model="selected" type="radio" value="C" />
      Celsius
    </label>
    &nbsp;
    <label for="fahrenheit" class="radio">
      <input id="fahrenheit" v-model="selected" type="radio" value="F" />
      Fahrenheit
    </label>
  </form>
</template>

<script>
import Vue from "vue";

const UnitsSelector = Vue.extend({
  props: {
    units: { type: String, default: "F" }
  },

  data() {
    return {
      selected: this.units
    };
  },

  emits: ["change-units"],

  watch: {
    selected(val) {
      this.$emit("change-units", val);
    }
  }
});
export default UnitsSelector;
</script>
