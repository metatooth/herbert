<template>
  <section class="section">
    <h2 class="title">{{ workersCount }} {{ workersName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>MAC</th>
          <th>INET</th>
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
import { mapState, mapGetters, mapActions } from "vuex";

const Workers = Vue.extend({
  components: {
    WorkerRow
  },

  computed: {
    workersName(): string {
      if (this.workersCount === 1) {
        return "Herbert";
      } else {
        return "Herberts";
      }
    },
    ...mapState("workers", ["workers"]),
    ...mapGetters("workers", ["workersCount"])
  },

  methods: {
    ...mapActions("workers", ["fetchData"])
  }
});

export default Workers;
</script>
