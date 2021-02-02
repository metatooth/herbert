<template>
  <div class="notification is-danger">
    <button class="delete" @click="$emit('delete-notification')"></button>
    <timestamp v-bind:timestamp="timestamp"></timestamp> --&nbsp;
    <span>{{ plug }}</span> --&nbsp;
    <span>{{ message }}</span>
  </div>
</template>

<script>
import Timestamp from "./Timestamp.vue";

import Vue from "vue";
import Component from "vue-class-component";

const NotificationProps = Vue.extend({
  props: {
    id: String,
    plug: String,
    message: String,
    timestamp: String
  }
});

@Component({
  components: {
    Timestamp
  }
})
export default class Notification extends NotificationProps {}
</script>

<style></style>
