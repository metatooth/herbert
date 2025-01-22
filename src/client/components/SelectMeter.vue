<script lang="ts">
import { Meter } from "@client/store/meters/types";

export default {
  props: {
    label: String,
    meters: { type: Array<Meter>, default: [] },
  },

  emits: ["select-meter"],

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
};
</script>

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
                :key="meter.device"
                :value="meter.device"
              >
                {{ meter.nickname || meter.device }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button class="button is-info" @click="select">
            <font-awesome-icon icon="plus" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
