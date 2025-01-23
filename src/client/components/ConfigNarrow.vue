<script lang="ts">
import Readable from "@client/components/Readable.vue";
import { Config } from "@client/store/configs/types";

export default {
  components: {
    Readable,
  },
  props: {
    config: Config,
  },
};
</script>

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
        <readable class="is-italic" :timestamp="new Date(config.updatedat)" />
      </div>
    </div>
  </nav>
</template>
