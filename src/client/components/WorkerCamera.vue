<template>
  <div class="box">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title">{{ worker.name }}</p>
      </div>
      <div class="card-image">
        <img :src="worker.camera" width="300px" height="225px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Worker } from "@/store/workers/types";

const WorkerCamera = Vue.extend({
  props: {
    worker: Worker,
  },
});

export default WorkerCamera;
</script>

<style></style>
