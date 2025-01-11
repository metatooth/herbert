<script lang="ts">
import HerbertButton from "@/components/HerbertButton.vue";

export default {
  components: {
    HerbertButton,
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
    <herbert-button color="info" icon="plus" :show="!adding" @on-click="on" />
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
