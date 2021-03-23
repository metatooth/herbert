<template>
  <tr>
    <td>
      {{ worker.worker }}
    </td>
    <td>
      {{ worker.inet }}
    </td>
    <td>
      <a @click="editable" v-if="!editing">
        <span v-if="worker.nickname">{{ worker.nickname }}</span>
        <span v-else>click to name</span>
      </a>
      <div class="field is-grouped" v-else>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="nickname"
            @keyup.esc="cancel"
          />
        </div>
        <div class="control">
          <button class="button is-primary" @click="save">
            <font-awesome-icon icon="check" />
          </button>
        </div>
        <div class="control">
          <button class="button is-danger" @click="cancel">
            <font-awesome-icon icon="times" />
          </button>
        </div>
      </div>
    </td>
    <td>
      <timestamp :timestamp="new Date(Date.parse(worker.updatedat))" />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";

import Timestamp from "@/components/Timestamp.vue";
import { Worker, WorkerState } from "@/store/workers/types";
import { mapActions } from "vuex";

const WorkerRow = Vue.extend({
  props: {
    state: WorkerState
  },

  data() {
    return {
      nickname: this.state.worker.nickname || "",
      editing: false
    };
  },

  components: {
    Timestamp
  },

  computed: {
    worker(): Worker {
      return this.state.worker;
    }
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      this.edit({
        ...this.state.worker,
        nickname: this.nickname
      });
      this.editing = false;
    },

    cancel() {
      this.nickname = this.state.worker.nickname;
      this.editing = false;
    },

    ...mapActions("workers", ["edit"])
  }
});

export default WorkerRow;
</script>
