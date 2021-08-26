<template>
  <section class="section">
    <div class="level">
      <span class="title">{{ configsCount }} {{ configsName }}</span>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical">
        <config-tile
          v-for="config in left"
          :key="config.nickname"
          :config="config"
        />
      </div>
      <div class="tile is-4 is-vertical">
        <config-tile
          v-for="config in middle"
          :key="config.nickname"
          :config="config"
        />
      </div>
      <div class="tile is-4 is-vertical">
        <config-tile
          v-for="config in right"
          :key="config.nickname"
          :config="config"
        />
      </div>
    </div>
    <div class="content" v-if="adding">
      <p class="title">
        <input
          class="input"
          type="text"
          placeHolder="Name this config"
          v-model="nickname"
          @keyup.esc="cancel"
          @keyup.enter="save"
        />
      </p>
      <span>
        <textarea class="textarea" v-model="config" @keyup.esc="cancel" />
      </span>
    </div>
    <add-controls @on-add="addable" @on-save="save" @on-cancel="cancel" />
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import AddControls from "@/components/AddControls.vue";
import ConfigTile from "@/components/ConfigTile.vue";
import { mapActions, mapGetters } from "vuex";

const Configs = Vue.extend({
  components: {
    AddControls,
    ConfigTile
  },

  data() {
    return {
      adding: false,
      nickname: "",
      config: ""
    };
  },

  computed: {
    ...mapGetters("configs", ["configs", "configsCount"]),

    configsName(): string {
      if (this.configsCount === 1) {
        return "Config";
      } else {
        return "Configs";
      }
    },

    left() {
      const configs = [];
      for (let i = 0; i < this.configsCount; i = i + 3) {
        if (this.configs[i]) {
          configs.push(this.configs[i]);
        }
      }
      return configs;
    },

    middle() {
      const configs = [];
      for (let i = 1; i < this.configsCount; i = i + 3) {
        if (this.configs[i]) {
          configs.push(this.configs[i]);
        }
      }
      return configs;
    },

    right() {
      const configs = [];
      for (let i = 2; i < this.configsCount; i = i + 3) {
        if (this.configs[i]) {
          configs.push(this.configs[i]);
        }
      }
      return configs;
    }
  },

  methods: {
    ...mapActions("configs", ["add"]),

    addable() {
      this.adding = true;
    },

    save() {
      const c = JSON.parse(this.config);
      this.add({
        nickname: this.nickname,
        config: c
      });
      this.adding = false;
    },

    cancel() {
      (this.nickname = ""), (this.config = ""), (this.adding = false);
    }
  }
});

export default Configs;
</script>
