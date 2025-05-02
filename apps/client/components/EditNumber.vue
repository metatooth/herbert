<script lang="ts">
import ButtonBase from "@client/components/ButtonBase.vue";

export default {
  components: {
    ButtonBase,
  },

  props: {
    num: Number,
    size: String,
    label: String,
    icon: String,
    color: { type: String, default: "#ffffff" },
  },

  emits: ["edit-number"],

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
};
</script>

<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <div class="tags has-addons">
          <span class="tag has-background-black" :style="text">
            <font-awesome-icon :icon="icon" />
          </span>
          <span class="tag has-text-black" :style="background">{{
            label
          }}</span>
        </div>
      </div>
      <div v-if="!editing" class="field">
        <span :class="valueClass">{{ edited || "undefined" }}</span>
        <button :class="buttonClass" @click="edit">
          <font-awesome-icon icon="edit" />
        </button>
      </div>
      <div v-else class="field is-grouped">
        <div class="control">
          <input
            v-model="edited"
            class="input"
            type="number"
            min="1"
            size="2"
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

.text {
  margin: 0px 20px;
}
</style>
