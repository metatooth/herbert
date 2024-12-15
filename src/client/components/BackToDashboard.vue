<template>
  <span class="tags has-addons">
    <span class="tag is-medium">
      <font-awesome-icon icon="chevron-circle-left"
    /></span>
    <span class="tag is-medium">
      <router-link :to="{ name: 'dashboard' }"> Back </router-link>
    </span>
  </span>
</template>

<script>
import Vue from "vue";

const BackToDashboard = Vue.extend({});

export default BackToDashboard;
</script>
