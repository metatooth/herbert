<script lang="ts">
import { mapActions, mapGetters } from "vuex";

import EditControls from "@client/components/EditControls.vue";
import Readable from "@client/components/Readable.vue";
import { Worker } from "@client/store/workers/types";

export default {
  components: {
    EditControls,
    Readable,
  },

  props: {
    locked: Boolean,
    worker: Worker,
  },

  data() {
    return {
      nickname: this.worker.nickname || this.worker.worker,
      configname: this.worker.configname,
      config: this.worker.config,
      readable: true,
      editing: false,
    };
  },

  computed: {
    camera() {
      if (this.worker.camera) {
        return this.worker.camera;
      }
      return null;
    },

    ...mapGetters("configs", ["configs"]),
  },

  watch: {
    configname() {
      this.configs.forEach((config) => {
        if (this.configname === config.nickname) {
          this.config = config.config;
        }
      });
    },
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      this.edit({
        ...this.worker,
        nickname: this.nickname,
        configname: this.configname,
      });
      this.editing = false;
    },

    destroy() {
      if (confirm("OK to remove?")) {
        this.remove(this.worker);
      }
    },

    cancel() {
      this.nickname = this.worker.nickname;
      this.configname = this.worker.configname;
      this.editing = false;
    },

    ...mapActions("workers", ["edit", "remove"]),
  },
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">
        <span v-if="editing">
          <input
            v-model="nickname"
            class="input"
            type="text"
            placeHolder="Name this worker"
            @keyup.esc="cancel"
            @keyup.enter="save"
          />
        </span>
        <span v-else>{{ nickname }}</span>
      </p>
      <p class="subtitle">
        <span class="icon has-text-success">
          <img src="../assets/images/icon.png" class="herbert-icon" />
        </span>
        <span class="tag">{{ worker.worker }}</span>
      </p>
      <div class="content">
        <select v-if="editing" v-model="configname">
          <option disabled value="">Select a config for this worker</option>
          <option v-for="item in configs" :key="item.nickname">
            {{ item.nickname }}
          </option>
        </select>
        <div class="is-family-code">
          {{ configname }}
        </div>
      </div>
      <div class="content">
        <span class="is-family-code">{{ worker.inet }}</span>
      </div>
      <div class="content">
        <img :src="camera" />
      </div>
      <div class="content is-italic">
        Updated <readable :timestamp="new Date(worker.updatedat)" />
      </div>
      <edit-controls
        v-if="!locked"
        @on-edit="editable"
        @on-save="save"
        @on-cancel="cancel"
        @on-destroy="destroy"
      />
    </div>
  </div>
</template>
