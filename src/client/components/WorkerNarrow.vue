<template>
  <nav class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <span class="icon has-text-success">
          <img src="../assets/images/icon.png" class="herbert-icon" />
        </span>
        <p class="subtitle is-7">
          <strong>{{ worker.name }}</strong
          ><br />
          {{ worker.inet }}
        </p>
      </div>
      <div class="level-item">
        <span class="is-family-code">{{ worker.configname }}</span>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <readable
          class="is-italic"
          :timestamp="new Date(Date.parse(worker.updatedat))"
        />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Worker } from "@/store/profiles/types";
import Readable from "@/components/Readable.vue";

const WorkerNarrow = Vue.extend({
  props: {
    worker: Worker
  },

  components: {
    Readable
  }
});

export default WorkerNarrow;
</script>
