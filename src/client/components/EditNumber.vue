<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <div class="tags has-addons">
          <span class="tag has-background-black" :style="text">
            <font-awesome-icon :icon="icon" />
          </span>
          <span class="tag has-text-black" :style="background">{{
            this.label
          }}</span>
        </div>
      </div>
      <div class="field" v-if="!editing">
        <span v-bind:class="valueClass">{{ this.edited || "undefined" }}</span>
        <button v-bind:class="buttonClass" @click="edit">
          <font-awesome-icon icon="edit" />
        </button>
      </div>
      <div class="field is-grouped" v-else>
        <div class="control">
          <input
            class="input"
            type="number"
            v-model="edited"
            min="1"
            size="2"
            @keyup.enter="save"
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

const EditNumber = Vue.extend({
  props: {
    num: Number,
    size: String,
    label: String,
    icon: String,
    color: { type: String, default: "#ffffff" },
  },

  components: {
    HerbertButton,
  },

  data() {
    return {
      edited: this.num,
      editing: false,
    };
  },

  computed: {
    buttonClass() {
      return `${name} is-${this.size}`;
    },

    background() {
      return `background-color: ${this.color}`;
    },

    text() {
      return `color: ${this.color}`;
    },

    valueClass() {
      if (this.size === "medium") {
        return "text";
      }
      return "title";
    },
  },

  methods: {
    edit() {
      this.editing = true;
    },

    save() {
      this.$emit("edit-number", this.edited);
      this.editing = false;
    },

    cancel() {
      this.edited = this.num;
      this.editing = false;
    },
  },
});
export default EditNumber;
</script>

<style scoped>
.title {
  margin: 0px 20px;
}

.text {
  margin: 0px 20px;
}
</style>
