<template>
  <nav class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <span class="icon has-text-success">
          <font-awesome-icon icon="file-code" />
        </span>
        <p class="subtitle is-7">
          <strong>{{ config.nickname }}</strong>
        </p>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <readable-timestamp
          class="is-italic"
          :timestamp="new Date(Date.parse(config.updatedat))"
        />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Config } from "@/store/configs/types";
import ReadableTimestamp from "@/components/ReadableTimestamp.vue";

const ConfigNarrow = Vue.extend({
  props: {
    config: Config,
  },

  components: {
    ReadableTimestamp,
  },
});

export default ConfigNarrow;
</script>
