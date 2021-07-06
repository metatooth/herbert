<template>
  <section class="section">
    <div class="level">
      <span class="title">{{ workersCount }} {{ workersName }}</span>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical">
        <worker-tile
          v-for="worker in left"
          :key="worker.worker"
          :worker="worker"
        />
      </div>
      <div class="tile is-4 is-vertical">
        <worker-tile
          v-for="worker in middle"
          :key="worker.worker"
          :worker="worker"
        />
      </div>
      <div class="tile is-4 is-vertical">
        <worker-tile
          v-for="worker in right"
          :key="worker.worker"
          :worker="worker"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import WorkerTile from "@/components/WorkerTile.vue";
import { mapGetters } from "vuex";

const Workers = Vue.extend({
  components: {
    WorkerTile
  },

  computed: {
    ...mapGetters("workers", ["workers", "workersCount"]),

    workersName(): string {
      if (this.workersCount === 1) {
        return "Herbert";
      } else {
        return "Herberts";
      }
    },

    left() {
      const workers = [];
      for (let i = 0; i < this.workersCount; i = i + 3) {
        if (this.workers[i]) {
          workers.push(this.workers[i]);
        }
      }
      console.log(workers);
      return workers;
    },

    middle() {
      const workers = [];
      for (let i = 1; i < this.workersCount; i = i + 3) {
        if (this.workers[i]) {
          workers.push(this.workers[i]);
        }
      }
      return workers;
    },

    right() {
      const workers = [];
      for (let i = 2; i < this.workersCount; i = i + 3) {
        if (this.workers[i]) {
          workers.push(this.workers[i]);
        }
      }
      return workers;
    }
  }
});

export default Workers;
</script>
