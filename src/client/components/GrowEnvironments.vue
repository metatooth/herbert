<template>
  <section class="section">
    <h2 class="subtitle">Grow Environments</h2>
    <span>{{ clients.length }} {{ clientsName }}</span>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Updated</th>
          <th>Current Conditions</th>
          <th>Systems</th>
          <th colspan="2">History</th>
        </tr>
      </thead>
      <tbody>
        <client-row
          v-for="client in clients"
          :key="client.id"
          :units="units"
          v-bind="client"
        />
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ClientRow from "@/components/ClientRow.vue";

const GrowEnvironments = Vue.extend({
  props: {
    clients: Array,
    units: String
  },

  components: {
    ClientRow
  },

  computed: {
    clientsName(): string {
      if (this.clients.length === 1) {
        return "client";
      } else {
        return "clients";
      }
    }
  }
});

export default GrowEnvironments;
</script>
