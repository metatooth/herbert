<template>
  <div class="field is-horizontal">
    <div class="field-label">
      <label class="label">Zones</label>
    </div>
    <div class="field-body">
      <div class="field has-addons">
        <div class="control">
          <div class="select">
            <select v-model="selected">
              <option
                v-for="zone in zones"
                v-bind:key="zone.id"
                v-bind:value="zone.id"
              >
                {{ zone.nickname }}
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

const SelectZone = Vue.extend({
  props: {
    zones: Array,
  },

  data() {
    return {
      selected: "",
    };
  },

  methods: {
    select() {
      this.$emit("select-zone", this.selected);
      this.selected = "";
    },
  },
});

export default SelectZone;
</script>
