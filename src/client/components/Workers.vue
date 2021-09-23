<template>
  <section class="section">
    <div class="level">
      <span class="title">{{ activeCount }} {{ workersName }}</span>
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
  props: {
    filter: String
  },

  components: {
    WorkerTile
  },

  computed: {
    ...mapGetters("workers", ["workers"]),

    activeSet() {
      const active = this.workers.filter(el => {
        if (el.nickname) {
          if (el.nickname.match(this.filter)) {
            return true;
          }
        }

        return el.worker.match(this.filter);
      });
      return active.sort((a, b) => {
        const A = a.nickname ? a.nickname : a.macaddr;
        const B = b.nickname ? b.nickname : b.macaddr;

        return A > B;
      });
    },

    activeCount() {
      return this.activeSet.length;
    },

    workersName(): string {
      if (this.activeCount === 1) {
        return "Herbert";
      } else {
        return "Herberts";
      }
    },

    left() {
      const workers = [];
      for (let i = 0; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          workers.push(this.activeSet[i]);
        }
      }
      return workers;
    },

    middle() {
      const workers = [];
      for (let i = 1; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          workers.push(this.activeSet[i]);
        }
      }
      return workers;
    },

    right() {
      const workers = [];
      for (let i = 2; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          workers.push(this.activeSet[i]);
        }
      }
      return workers;
    }
  }
});

export default Workers;
</script>
