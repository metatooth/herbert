<template>
  <div class="control" v-if="show">
    <button class="button" @click="$emit('on-click')">
      <font-awesome-icon :icon="icon" />
      <span>{{ label }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const Button = Vue.extend({
  props: {
    show: Boolean,
    callback: Function,
    icon: String,
    label: String
  }
});
export default Button;
</script>
