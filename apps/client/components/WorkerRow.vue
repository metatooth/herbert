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
      nickname: this.worker.nickname,
      configname: this.worker.configname,
      config: this.worker.config,
      editing: false,
    };
  },

  computed: {
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
      this.remove(this.worker);
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
  <tr>
    <td>
      {{ worker.worker }}
    </td>
    <td>
      {{ worker.inet }}
    </td>
    <td>
      <span v-if="!editing">
        {{ worker.name }}
      </span>
      <span v-else>
        <input
          v-model="nickname"
          class="input"
          type="text"
          placeHolder="Name this worker"
          @keyup.esc="cancel"
          @keyup.enter="save"
        />
      </span>
    </td>
    <td>
      <select v-if="editing" v-model="configname">
        <option disabled value="">Select a config for this worker</option>
        <option v-for="config in configs" :key="config.nickname">
          {{ config.nickname }}
        </option>
      </select>
      <div class="is-family-code">
        {{ worker.configname }}
      </div>
    </td>
    <td class="is-italic">
      <readable :timestamp="new Date(worker.updatedat)" />
    </td>
    <td>
      <edit-controls
        v-if="!locked"
        @on-edit="editable"
        @on-save="save"
        @on-cancel="cancel"
        @on-destroy="destroy"
      />
    </td>
  </tr>
</template>
