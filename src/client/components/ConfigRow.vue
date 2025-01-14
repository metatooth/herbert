<template>
  <tr>
    <td>
      <span v-if="editing">
        <input
          v-model="nickname"
          class="input"
          type="text"
          placeHolder="Name this config"
          @keyup.esc="cancel"
          @keyup.enter="save"
        />
      </span>
      <span v-else>{{ config.nickname }}</span>
    </td>
    <td>
      <span v-if="editing">
        <textarea v-model="configStr" class="textarea" @keyup.esc="cancel" />
      </span>
      <span v-else class="is-family-code">
        {{ config.config }}
      </span>
    </td>
    <td class="is-italic">
      <readable :timestamp="new Date(Date.parse(config.updatedat))" />
    </td>
    <td>
      <edit-controls @on-edit="editable" @on-save="save" @on-cancel="cancel" />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";

import EditControls from "@/components/EditControls.vue";
import Readable from "@/components/Readable.vue";
import { Config } from "@/store/configs/types";
import { mapActions } from "vuex";

const ConfigTile = Vue.extend({
  components: {
    EditControls,
    Readable,
  },
  props: {
    config: Config,
  },

  data() {
    return {
      nickname: this.config.nickname,
      configStr: this.config.toString(),
      readable: true,
      editing: false,
    };
  },

  computed: {
    lastupdate() {
      return new Date(Date.parse(this.config.updatedat));
    },
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      this.edit({
        ...this.config,
        nickname: this.nickname,
        config: this.configStr,
        currentName: this.config.nickname,
      });
      this.editing = false;
    },

    cancel() {
      this.nickname = this.config.nickname;
      this.configStr = this.config.toString();
      this.editing = false;
    },

    ...mapActions("configs", ["edit"]),
  },
});

export default ConfigTile;
</script>
