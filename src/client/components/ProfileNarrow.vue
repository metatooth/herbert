<template>
  <nav class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <p class="subtitle is-7">
          <strong>{{ profile.profile.slice(0, 12) }}</strong>
        </p>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <div class="tags has-addons">
          <div class="tag has-background-black-bis" :style="style">
            {{ duration }}hrs
          </div>
          <div class="tag has-background-black-bis" :style="style">
            {{ temperature.toFixed(0) }}°
          </div>
          <div class="tag has-background-black-bis" :style="style">
            {{ humidity }}%
          </div>
        </div>
      </div>
      <div class="level-item">
        <button class="button is-small" @click="toggle">
          <font-awesome-icon :icon="icon" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Profile } from "@/store/profiles/types";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";

const ProfileNarrow = Vue.extend({
  props: {
    profile: Profile,
  },

  data() {
    return {
      day: true,
      ts: new Date(),
    };
  },

  computed: {
    duration(): number {
      const hours = this.profile.lampduration["hours"];
      return this.day ? hours : 24 - hours;
    },

    humidity(): number {
      return this.profile.targetHumidity(this.ts);
    },

    icon(): string {
      if (this.day) {
        return "caret-up";
      } else {
        return "caret-down";
      }
    },

    style(): string {
      if (this.day) {
        return "color: #ffe08a";
      } else {
        return "color: #7a7a7a";
      }
    },

    temperature(): number {
      const temp = this.day
        ? this.profile.lampontemperature
        : this.profile.lampofftemperature;
      if (this.settings.units === "F") {
        return celsius2fahrenheit(temp);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(temp);
      }
      return temp;
    },

    ...mapGetters("settings", ["settings"]),
  },

  methods: {
    toggle() {
      this.day = !this.day;
    },
  },
});

export default ProfileNarrow;
</script>
