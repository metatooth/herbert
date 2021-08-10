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
        <span v-if="editing">
          <textarea class="textarea" v-model="config" @keyup.esc="cancel" />
        </span>
        <span class="is-family-code" v-else>
          {{ this.worker.config }}
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
import { mapActions } from "vuex";

const WorkerTile = Vue.extend({
  props: {
    worker: Worker
  },

  data() {
    return {
      nickname: this.worker.nickname,
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
    }
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      this.edit({
        ...this.worker,
        nickname: this.nickname,
        config: this.config
      });
      this.editing = false;
    },

    cancel() {
      this.nickname = this.worker.nickname;
      this.config = JSON.stringify(this.worker.config);
      this.editing = false;
    },

    ...mapActions("workers", ["edit"])
  }
});

export default WorkerTile;
</script>
