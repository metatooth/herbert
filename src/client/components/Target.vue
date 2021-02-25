<template>
  <div class="control">
    <div class="tags has-addons">
      <span class="tag has-text-black-bis has-background-grey-lighter">
        {{ formatted }} {{ units }}
      </span>
      <span class="tag has-text-white-bis has-background-black-bis">
        <font-awesome-icon :icon="icon" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

const TargetProps = Vue.extend({
  props: {
    icon: { type: String, default: "" },
    value: { type: Number, default: 0 },
    precision: { type: Number, default: 0 },
    units: { type: String, default: "C" }
  }
});

@Component
export default class Target extends TargetProps {
  get formatted(): string {
    return this.value.toFixed(this.precision);
  }
}
</script>
