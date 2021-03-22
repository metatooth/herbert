<template>
  <div class="field is-grouped is-grouped-center">
    <herbert-button label="Add" icon="plus" :show="!adding" @on-click="on" />
    <herbert-button label="Save" icon="check" :show="adding" @on-click="save" />
    <herbert-button
      label="Cancel"
      icon="times"
      :show="adding"
      @on-click="cancel"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HerbertButton from "@/components/Button.vue";

const AddControls = Vue.extend({
  data() {
    return {
      adding: false
    };
  },

  components: {
    HerbertButton
  },

  methods: {
    on() {
      console.log("ON");
      this.$emit("on-add");
      this.adding = true;
    },

    save() {
      console.log("SAVE");
      this.$emit("on-save");
      this.adding = false;
    },

    cancel() {
      console.log("CANCEL");
      this.$emit("on-cancel");
      this.adding = false;
    }
  }
});
export default AddControls;
</script>
