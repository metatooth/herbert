<template>
  <div class="control">
    <div class="select">
      <select v-model="selected">
        <option
          v-for="type in controltypes"
          v-bind:key="type"
          v-bind:value="type"
        >
          {{ type }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const SelectControlType = Vue.extend({
  props: {
    controltype: String
  },

  data() {
    return {
      controltypes: ["HI_LO", "TARGETS", "VPD"],
      selected: this.controltype
    };
  },

  watch: {
    selected(val: string) {
      this.$emit("select-controltype", val);
    }
  }
});

export default SelectControlType;
</script>
