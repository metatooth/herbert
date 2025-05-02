<script lang="ts">
import AddControls from "@client/components/AddControls.vue";
import NarrowRow from "@client/components/NarrowRow.vue";

import { Config } from "@client/store/configs/types";
import { Device } from "@client/store/devices/types";
import { Meter } from "@client/store/meters/types";
import { Profile } from "@client/store/profiles/types";
import { Worker } from "@client/store/workers/types";
import { Zone } from "@client/store/zones/types";

export default {
  components: {
    AddControls,
    NarrowRow,
  },

  props: {
    items: { type: Array<object>, default: [] },
    type: { type: String, default: "" },
    locked: Boolean,
  },

  data() {
    return {
      nickname: "",
      adding: false,
    };
  },

  computed: {
    allowed() {
      switch (this.type) {
        case "config":
        case "profile":
        case "zone":
          return true;
          break;
        default:
          return false;
      }
    },
  },

  methods: {
    addable() {
      this.adding = true;
    },

    cancel() {
      this.nickname = "";
      this.adding = false;
    },

    save() {
      switch (this.type) {
        case "config":
          const config = new Config();
          config.nickname = this.nickname;
          config.config = { changeme: true };
          this.$store.dispatch("configs/add", config);
          break;
        case "profile":
          const profile = new Profile();
          // WARNING!
          profile.profile = this.nickname;
          profile.timezone = "America/New_York";
          profile.lampstart = "12:00";
          profile.lampduration = { hours: 12 };

          profile.lampontemperature = 23;
          profile.lampofftemperature = 18;

          profile.lamponhumidity = 55;
          profile.lampoffhumidity = 55;

          profile.bloweractive = 30000;
          profile.blowercycle = 180000;

          profile.irrigationperday = 2;
          profile.irrigationduration = 210000;

          this.$store.dispatch("profiles/add", profile);
          break;
        case "zone":
          const zone = new Zone();
          zone.nickname = this.nickname;
          zone.profileid = 1;

          this.$store.dispatch("zones/add", zone);
          break;
        default:
      }

      this.nickname = "";
      this.adding = false;
    },
  },
};
</script>

<template>
  <div>
    <narrow-row
      v-for="(item, index) in items"
      :key="`item-${index}`"
      :item="item"
      :type="type"
    />
  </div>
  <div v-if="allowed && !locked" class="box">
    <p class="title">
      <add-controls @on-add="addable" @on-save="save" @on-cancel="cancel" />
    </p>
    <div v-if="adding" class="content">
      <div class="control">
        <input
          v-model="nickname"
          class="input"
          type="text"
          placeHolder="Nickname"
          @keyup.esc="cancel"
          @keyup.enter="save"
        />
      </div>
    </div>
  </div>
</template>
