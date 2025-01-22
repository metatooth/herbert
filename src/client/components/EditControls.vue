<script lang="ts">
import HerbertButton from "@client/components/HerbertButton.vue";

export default {
  components: {
    HerbertButton,
  },

  emits: ["on-edit", "on-save", "on-destroy", "on-cancel"],

  data() {
    return {
      editing: false,
    };
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
      if (confirm("OK to trash?")) {
        this.$emit("on-destroy");
      }
    },

    cancel() {
      this.$emit("on-cancel");
      this.editing = false;
    },
  },
};
</script>

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
