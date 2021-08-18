<template>
  <div class="field is-grouped is-grouped-center">
    <herbert-button
      color="info"
      icon="plus"
      :show="!adding"
      @on-click="on"
    />
    <herbert-button
      color="success"
      icon="check"
      :show="adding"
      @on-click="save"
    />
    <herbert-button
      color="danger"
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
      this.$emit("on-add");
      this.adding = true;
    },

    save() {
      this.$emit("on-save");
      this.adding = false;
    },

    cancel() {
      this.$emit("on-cancel");
      this.adding = false;
    }
  }
});
export default AddControls;
</script>
