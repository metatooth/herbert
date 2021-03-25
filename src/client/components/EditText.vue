<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field" v-if="!editing">
        <span v-bind:class="valueClass">{{ text || "undefined" }}</span>
        <button class="button" @click="edit">
          <font-awesome-icon icon="edit" />
        </button>
      </div>
      <div class="field is-grouped" v-else>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="edited"
            @keyup.esc="cancel"
          />
        </div>
        <herbert-button label="" :show="true" icon="check" @on-click="save" />
        <herbert-button label="" :show="true" icon="times" @on-click="cancel" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HerbertButton from "@/components/Button.vue";

const EditText = Vue.extend({
  props: {
    text: String,
    size: String
  },

  components: {
    HerbertButton
  },

  data() {
    return {
      edited: this.text,
      editing: false
    };
  },

  computed: {
    valueClass() {
      let name = "title";
      if (this.size === "medium") {
        name = "text";
      }
      return name;
    }
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
    }
  }
});
export default EditText;
</script>

<style scoped>
.title {
  margin: 0px 20px;
}
</style>
