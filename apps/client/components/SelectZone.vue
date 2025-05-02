<script lang="ts">
import { Zone } from "@client/store/zones/types";

export default {
  props: {
    zones: { type: Array<Zone>, default: [] },
  },

  emits: ["select-zone"],

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
};
</script>

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
              <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                {{ zone.nickname }}
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
