<template>
  <div class="field is-horizontal">
    <div class="field-label">
      <label class="label">Meters</label>
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
import { mapGetters } from "vuex";

const SelectMeter = Vue.extend({
  data() {
    return {
      selected: ""
    };
  },

  computed: {
    ...mapGetters("meters", ["meters"])
  },

  methods: {
    select() {
      console.log("HERE");
      console.log("SELECT METER", this.selected);
      this.$emit("select-meter", this.selected);
      this.selected = "";
    }
  }
});

export default SelectMeter;
</script>
