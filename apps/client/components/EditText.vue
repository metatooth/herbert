<script lang="ts">
import ButtonBase from "@client/components/ButtonBase.vue";

export default {
  components: {
    ButtonBase,
  },

  props: {
    text: String,
    size: String,
    label: String,
    icon: String,
  },

  emits: ["edit-text"],

  data() {
    return {
      edited: this.text,
      editing: false,
    };
  },

  computed: {
    valueClass() {
      let name = "title";
      if (this.size === "medium") {
        name = "text";
      }
      return name;
    },
  },

  methods: {
    edit() {
      this.editing = true;
    },

    save() {
      this.$emit("edit-text", this.edited);
      this.editing = false;
    },

    cancel() {
      this.edited = this.text;
      this.editing = false;
    },
  },
};
</script>

<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <div v-if="!editing" class="field">
        <span :class="valueClass">{{ text || "undefined" }}</span>
        <button class="button" @click="edit">
          <font-awesome-icon icon="edit" />
        </button>
      </div>
      <div v-else class="field is-grouped">
        <div class="control">
          <input
            v-model="edited"
            class="input"
            type="text"
            @keyup.enter="save"
            @keyup.esc="cancel"
          />
        </div>
        <button-base label="" :show="true" icon="check" @on-click="save" />
        <button-base label="" :show="true" icon="times" @on-click="cancel" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  margin: 0px 20px;
}
</style>
