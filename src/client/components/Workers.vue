<template>
  <section class="section">
    <h2 class="subtitle">{{ workers.length }} {{ workersName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>MAC</th>
          <th>Nickname</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        <worker-row
          v-for="worker in workers"
          v-bind:key="worker.worker"
          v-bind:worker="worker"
        />
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import WorkerRow from "@/components/WorkerRow.vue";

const Workers = Vue.extend({
  props: {
    workers: Array
  },

  components: {
    WorkerRow
  },

computed: {
    workersName(): string {
      if (this.workers.length === 1) {
        return "Herbert";
      } else {
        return "Herberts";
      }
    }
}

});

export default Workers;
</script>
