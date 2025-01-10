<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

const SelectZoneForDevice = Vue.extend({
  props: {
    zoneid: number
  },

  emits: ["select-zone"],

  data() {
    return {
      selected: this.zoneid
    };
  },

  computed: {
    ...mapGetters("zones", ["zones"])
  },

  watch: {
    selected(val: string) {
      this.$emit("select-zone", val);
    }
  }
});

export default SelectZoneForDevice;
</script>

<template>
  <div class="control has-icons-left">
    <div class="select is-small">
      <select v-model="selected">
        <option v-for="zone in zones" :key="zone.id" :value="zone.id">
          {{ zone.nickname }}
        </option>
      </select>
    </div>
    <span class="icon is-small is-left">
      <font-awesome-icon icon="grip-horizontal" />
    </span>
  </div>
</template>
