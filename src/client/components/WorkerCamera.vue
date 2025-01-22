<script lang="ts">
import { Worker } from "@client/store/workers/types";

export default {
  props: {
    worker: Worker,
  },
};
</script>

<template>
  <div class="box">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title">
          {{ worker.name }}
        </p>
      </div>
      <div class="card-image">
        <img :src="worker.camera.toString()" width="300px" height="225px" />
      </div>
    </div>
  </div>
</template>
