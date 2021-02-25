<template>
  <section class="section">
    <h2 class="subtitle">Client Configurations</h2>
    <div class="tile is-ancestor">
      <client-card
        v-for="client in clients"
        v-bind="client"
        :key="client.id"
        :units="units"
        :profiles="profiles"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ClientCard from "@/components/ClientCard.vue";

const ClientConfigurations = Vue.extend({
  props: {
    clients: Array,
    profiles: Array,
    units: String
  },

  components: {
    ClientCard
  }
});

export default ClientConfigurations;
</script>
