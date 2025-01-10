<script lang="ts">
import Vue from "vue";

const SelectControlType = Vue.extend({
  props: {
    controltype: string
  },

  emits: ["select-controltype"],

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

<template>
  <div class="control">
    <div class="select">
      <select v-model="selected">
        <option v-for="type in controltypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>
  </div>
</template>
