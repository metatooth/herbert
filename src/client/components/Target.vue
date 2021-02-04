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
    icon: { type: String, default: '' },
    value: { type: Number, default: 0 },
    precision: { type: Number, default: 0},
    units: { type: String, default: 'C' }
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
