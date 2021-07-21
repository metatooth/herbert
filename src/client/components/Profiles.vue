<template>
  <section class="section">
    <span class="title">{{ profilesCount }} {{ profilesName }}</span>
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical">
        <profile-tile
          v-for="profile in left"
          :key="profile.id"
          :profile="profile"
          :units="settings.units"
        />
      </div>
      <div class="tile is-4 is-vertical">
        <profile-tile
          v-for="profile in middle"
          :key="profile.id"
          :profile="profile"
          :units="settings.units"
        />
      </div>
      <div class="tile is-4 is-vertical">
        <profile-tile
          v-for="profile in right"
          :key="profile.id"
          :profile="profile"
          :units="settings.units"
        />
        <div class="tile is-parent">
          <div class="tile is-child box">
            <p class="title">
              <add-controls
                @on-add="addable"
                @on-save="save"
                @on-cancel="cancel"
              />
            </p>
            <div class="content" v-if="adding">
              <div class="field is-grouped is-grouped-multiline">
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="profile"
                    placeHolder="Name for profile"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { Profile } from "@/store/profiles/types";
import ProfileTile from "@/components/ProfileTile.vue";
import AddControls from "@/components/AddControls.vue";
import {
  celsius2fahrenheit,
  celsius2kelvin,
  fahrenheit2celsius,
  kelvin2celsius
} from "../../shared/utils";

const Profiles = Vue.extend({
  data() {
    return {
      profile: "",
      timezone: "America/New_York",
      start: "08:00",
      duration: 12,
      lampontemperature: 23,
      lamponhumidity: 25,
      lampofftemperature: 18,
      lampoffhumidity: 25,
      adding: false
    };
  },

  components: {
    AddControls,
    ProfileTile
  },

  computed: {
    left() {
      const profiles = [];
      for (let i = 0; i < this.profilesCount; i = i + 3) {
        if (this.profiles[i]) {
          profiles.push(this.profiles[i]);
        }
      }
      return profiles;
    },

    middle() {
      const profiles = [];
      for (let i = 1; i < this.profilesCount; i = i + 3) {
        if (this.profiles[i]) {
          profiles.push(this.profiles[i]);
        }
      }
      return profiles;
    },

    right() {
      const profiles = [];
      for (let i = 2; i < this.profilesCount; i = i + 3) {
        if (this.profiles[i]) {
          profiles.push(this.profiles[i]);
        }
      }
      return profiles;
    },

    profilesName(): string {
      if (this.profilesCount === 1) {
        return "Profile";
      } else {
        return "Profiles";
      }
    },

    tempMin(): number {
      let min = 15;
      if (this.settings.units === "F") {
        min = celsius2fahrenheit(min);
      } else {
        min = celsius2kelvin(min);
      }

      return min;
    },

    tempMax(): number {
      let max = 30;
      if (this.settings.units === "F") {
        max = celsius2fahrenheit(max);
      } else {
        max = celsius2kelvin(max);
      }

      return max;
    },

    ...mapGetters("profiles", ["profilesCount", "profiles"]),

    ...mapGetters("settings", ["settings"])
  },

  mounted() {
    this.reset();
  },

  methods: {
    addable() {
      this.adding = true;
    },

    save() {
      const start = this.start.split(":");
      let hourInt = parseInt(start[0]) + 4; // WARNING!
      if (hourInt > 24) {
        hourInt = hourInt - 24;
      }
      let hourString;
      if (hourInt < 10) {
        hourString = "0" + hourInt;
      } else {
        hourString = hourInt.toString();
      }

      const profile = new Profile();
      profile.profile = this.profile;
      profile.lampstart = `${hourString}:${start[1]}`;
      profile.lampduration = { hours: this.duration };
      if (this.settings.units === "F") {
        profile.lampontemperature = fahrenheit2celsius(this.lampontemperature);
        profile.lampofftemperature = fahrenheit2celsius(
          this.lampofftemperature
        );
      } else if (this.settings.units === "K") {
        profile.lampontemperature = kelvin2celsius(this.lampontemperature);
        profile.lampofftemperature = kelvin2celsius(this.lampofftemperature);
      } else {
        profile.lampontemperature = this.lampontemperature;
        profile.lampofftemperature = this.lampofftemperature;
      }

      profile.lamponhumidity = this.lamponhumidity;
      profile.lampoffhumidity = this.lampoffhumidity;

      this.add(profile);
      this.adding = false;
    },

    cancel() {
      this.reset();
      this.adding = false;
    },

    reset() {
      let on = 23;
      let off = 18;

      if (this.settings.units === "F") {
        on = celsius2fahrenheit(on);
        off = celsius2fahrenheit(off);
      } else if (this.settings.units === "K") {
        on = celsius2kelvin(on);
        off = celsius2kelvin(off);
      }

      this.profile = "";
      this.timezone = "America/New_York";
      this.start = "08:00";
      this.duration = 12;
      this.lampontemperature = on;
      this.lamponhumidity = 25;
      this.lampofftemperature = off;
      this.lampoffhumidity = 25;
    },

    ...mapActions("profiles", ["add"])
  }
});
export default Profiles;
</script>
