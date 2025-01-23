<script lang="ts">
import { mapGetters } from "vuex";

import AddControls from "@client/components/AddControls.vue";
import FullRow from "@client/components/FullRow.vue";

import { Config } from "@client/store/configs/types";
import { Device } from "@client/store/devices/types";
import { Meter } from "@client/store/meters/types";
import { Profile } from "@client/store/profiles/types";
import { Worker } from "@client/store/workers/types";
import { Zone } from "@client/store/zones/types";

export default {
  components: {
    AddControls,
    FullRow,
  },

  props: {
    headings: { type: Array<string>, default: [] },
    items: { type: Array<object>, default: [] },
    locked: { type: Boolean, default: true },
    type: { type: String, required: true },
  },

  data() {
    return {
      adding: false,
      nickname: "",
    };
  },

  computed: {
    allowed() {
      let allowed = false;
      switch (this.type) {
        case "config":
        case "profile":
        case "zone":
          allowed = true;
          break;
        default:
      }
      return allowed;
    },

    ...mapGetters("settings", ["settings"]),
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
  <table class="table">
    <thead>
      <th v-for="(heading, index) in headings" :key="`heading-${index}`">
        {{ heading }}
      </th>
    </thead>
    <tbody>
      <full-row
        v-for="(item, index) in items"
        :key="`item-${index}`"
        :item="item"
        :type="type"
        :units="settings.units"
        :locked="locked"
      />
      <tr v-if="allowed && !locked">
        <td v-if="adding">
          <input
            v-model="nickname"
            class="input"
            type="text"
            placeHolder="Nickname"
            @keyup.esc="cancel"
            @keyup.enter="save"
          />
        </td>
        <td>
          <add-controls @on-add="addable" @on-save="save" @on-cancel="cancel" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
