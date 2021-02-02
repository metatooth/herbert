<template>
  <div class="tag">
    <font-awesome-icon :icon="icon" />
    &nbsp;
    <span>{{ formatted }} {{ units }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

const TargetProps = Vue.extend({
  props: {
    icon: String,
    value: Number,
    precision: Number,
    units: String
  }
});

@Component
export default class Target extends TargetProps {
  get formatted(): string {
    return this.value.toFixed(this.precision);
  }
}
</script>

<style>
.tag {
  width: 300px;
}
</style>
