<template>
  <div :class="divClass">
    <p class="control">
      <herbert-button
        color="warning"
        icon="edit"
        :show="!editing"
        @on-click="edit"
      />
    </p>
    <p class="control">
      <herbert-button
        color="danger"
        icon="trash"
        :show="!editing"
        @on-click="destroy"
      />
    </p>
    <p class="control">
      <herbert-button
        color="success"
        icon="check"
        :show="editing"
        @on-click="save"
      />
    </p>
    <p class="control">
      <herbert-button
        color="danger"
        icon="times"
        :show="editing"
        @on-click="cancel"
      />
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HerbertButton from "@/components/Button.vue";

const EditControls = Vue.extend({
  props: {
    stacked: { type: Boolean, default: false }
  },

  data() {
    return {
      editing: false
    };
  },

  components: {
    HerbertButton
  },

  computed: {
    divClass() {
      let div = "field is-grouped ";
      if (this.stacked === true) {
        div += "is-grouped-multiline";
      } else {
        div += "is-grouped-right";
      }
      return div;
    }
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
