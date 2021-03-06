<template>
  <tr>
    <td>
      {{ worker.worker }}
    </td>
    <td>
      <a @click="edit" v-if="!editing">
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
      <timestamp :timestamp="new Date(Date.parse(worker.udpatedat))" />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";

import Timestamp from "@/components/Timestamp.vue";

const WorkerRow = Vue.extend({
  props: {
    worker: Object
  },

  data() {
    return {
      nickname: this.worker.nickname,
      editing: false
    };
  },

  components: {
    Timestamp
  },

  methods: {
    edit() {
      this.editing = true;
    },

    save() {
      this.$store.dispatch("editWorker", {
        ...this.worker,
        nickname: this.nickname
      });
      this.editing = false;
    },

    cancel() {
      this.nickname = this.worker.nickname;
      this.editing = false;
    }
  }
});

export default WorkerRow;
</script>
