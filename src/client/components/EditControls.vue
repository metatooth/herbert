<template>
  <span class="field is-grouped is-grouped-right">
    <herbert-button
      color="warning"
      icon="edit"
      :show="!editing"
      @on-click="edit"
    />
    <herbert-button
      color="danger"
      icon="trash"
      :show="!editing"
      @on-click="destroy"
    />
    <herbert-button
      color="success"
      icon="check"
      :show="editing"
      @on-click="save"
    />
    <herbert-button
      color="danger"
      icon="times"
      :show="editing"
      @on-click="cancel"
    />
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import HerbertButton from "@/components/Button.vue";

const EditControls = Vue.extend({
  data() {
    return {
      editing: false
    };
  },

  components: {
    HerbertButton
  },

  methods: {
    edit() {
      this.$emit("on-edit");
      this.editing = true;
    },

    save() {
      this.$emit("on-save");
      this.editing = false;
    },

    destroy() {
      this.$emit("on-destroy");
    },

    cancel() {
      this.$emit("on-cancel");
      this.editing = false;
    }
  }
});
export default EditControls;
</script>
