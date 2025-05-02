<script lang="ts">
export default {};
</script>

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
