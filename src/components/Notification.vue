<template>
  <div class="notification is-danger">
  <button class="delete" v-on:click="close"></button>
    <timestamp v-bind:updated_at="timestamp"></timestamp>
    <span>{{plug}}</span> &nbsp;
    <span>{{message}}</span>
  </div>
</template>

<script>
import Timestamp from './Timestamp.vue'

export default {
  name: 'Notification',
  components: {
    Timestamp
  },
  props: {
    id: String,
    updated_at: String,
    plug: String,
    message: String,
    onclose: Function,
    timestamp: String
  },
  methods: {
    close () {
      this.onclose()
    }
  }
}
</script>

<style>
</style>
