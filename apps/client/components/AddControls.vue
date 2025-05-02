<script lang="ts">
import ButtonBase from "@client/components/ButtonBase.vue";

export default {
  components: {
    ButtonBase,
  },

  emits: ["on-add", "on-save", "on-cancel"],

  data() {
    return {
      adding: false,
    };
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
    },
  },
};
</script>

<template>
  <div class="field is-grouped is-grouped-center">
    <button-base color="info" icon="plus" :show="!adding" @on-click="on" />
    <button-base color="success" icon="check" :show="adding" @on-click="save" />
    <button-base
      color="danger"
      icon="times"
      :show="adding"
      @on-click="cancel"
    />
  </div>
</template>
