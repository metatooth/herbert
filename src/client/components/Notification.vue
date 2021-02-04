<template>
  <div class="notification is-danger">
    <button
      class="delete"
      @click="$emit('delete-notification')"
    />
    <timestamp :timestamp="timestamp" /> --&nbsp;
    <span>{{ plug }}</span> --&nbsp;
    <span>{{ message }}</span>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import Timestamp from "Components/Timestamp.vue";

const NotificationProps = Vue.extend({
  props: {
    id: { type: String, default: '' },
    plug: { type: String, default: '' },
    message: { type: String, default: '' },
    timestamp: { type: String, default: new Date() }
  },
  emits: [ 'delete-notification' ]
});

@Component({
  components: { Timestamp }
})
export default class Notification extends NotificationProps {
}
</script>

<style></style>
