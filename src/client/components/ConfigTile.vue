<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">
        <span v-if="editing">
          <input
            class="input"
            type="text"
            placeHolder="Name this config"
            v-model="nickname"
            @keyup.esc="cancel"
            @keyup.enter="save"
          />
        </span>
        <span v-else>{{ config.nickname }}</span>
      </p>
      <p class="subtitle">
        <span class="icon has-text-success">
          <font-awesome-icon icon="file-code" />
        </span>
        <span class="tag">{{ config.nickname }}</span>
      </p>
      <div class="content">
        <span v-if="editing">
          <textarea class="textarea" v-model="configStr" @keyup.esc="cancel" />
        </span>
        <span class="is-family-code" v-else>
          {{ this.config.config }}
        </span>
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
import { Config } from "@/store/configs/types";
import { mapActions } from "vuex";

const ConfigTile = Vue.extend({
  props: {
    config: Config
  },

  data() {
    return {
      nickname: this.config.nickname,
      timestamp: new Date(Date.parse(this.config.updatedat)),
      configStr: this.config.toString(),
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
      return new Date(Date.parse(this.config.updatedat));
    }
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

    ...mapActions("configs", ["edit"])
  }
});

export default ConfigTile;
</script>
