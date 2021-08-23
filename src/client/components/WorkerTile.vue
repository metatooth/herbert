<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">
        <span v-if="editing">
          <input
            class="input"
            type="text"
            placeHolder="Name this worker"
            v-model="nickname"
            @keyup.esc="cancel"
            @keyup.enter="save"
          />
        </span>
        <span v-else>{{ worker.nickname || worker.worker }}</span>
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
          <option v-for="config in configs" :key="config.nickname">
            {{ config.nickname}}
          </option>
        </select>
        <span class="is-family-code">
          {{ worker.configname }} : {{ worker.config }}
        </span>
      </div>
      <div class="content">
        <span class="is-family-code">{{ worker.inet }}</span>
      </div>
      <div class="content">
        <timestamp :timestamp="timestamp" :readable="readable" />
      </div>
      <edit-controls @on-edit="editable" @on-save="save" @on-cancel="cancel" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import EditControls from "@/components/EditControls.vue";
import Timestamp from "@/components/Timestamp.vue";
import { Worker } from "@/store/workers/types";
import { mapActions, mapState } from "vuex";

const WorkerTile = Vue.extend({
  props: {
    worker: Worker
  },

  data() {
    return {
      nickname: this.worker.nickname,
      configname: this.worker.configname,
      timestamp: new Date(Date.parse(this.worker.updatedat)),
      config: JSON.stringify(this.worker.config),
      readable: true,
      editing: false
    };
  },

  components: {
    EditControls,
    Timestamp
  },

  computed: {
    lastupdate() {
      return new Date(Date.parse(this.worker.updatedat));
    },
    ...mapState("configs", ["configs"])
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

    cancel() {
      this.nickname = this.worker.nickname;
      this.configname = this.worker.configname;
      this.editing = false;
    },

    ...mapActions("workers", ["edit"]),
  }
});

export default WorkerTile;
</script>
