<script lang="ts">
export default {
  props: {
    controltype: String,
  },

  emits: ["select-controltype"],

  data() {
    return {
      controltypes: ["HI_LO", "TARGETS", "VPD"],
      selected: this.controltype,
    };
  },

  watch: {
    selected(val: string) {
      this.$emit("select-controltype", val);
    },
  },
};
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
