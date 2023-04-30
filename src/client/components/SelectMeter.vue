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
                v-for="meter in meters"
                v-bind:key="meter.device"
                v-bind:value="meter.device"
              >
                {{ meter.nickname || meter.device }}
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

const SelectMeter = Vue.extend({
  props: {
    label: String,
    meters: Array,
  },

  data() {
    return {
      selected: "",
    };
  },

  methods: {
    select() {
      this.$emit("select-meter", this.selected);
      this.selected = "";
    },
  },
});

export default SelectMeter;
</script>
