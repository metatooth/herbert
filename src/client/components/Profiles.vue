<template>
  <section class="section">
    <h2 class="title">{{ profilesCount }} {{ profilesName }}</h2>
    <table class="table is-full-width is-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th colspan="2">Lamps</th>
          <th class="has-background-warning has-text-centered">
            <font-awesome-icon icon="sun" />
          </th>
          <th class="has-text-white has-background-info has-text-centered">
            <font-awesome-icon icon="moon" />
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <profile-row
          v-for="profile in profiles"
          v-bind:key="profile.id"
          v-bind:profile="profile"
          v-bind:units="units"
        />

        <tr>
          <td>
            <div class="control" v-if="adding">
              <input
                class="input"
                type="text"
                v-model="profile"
                size="10"
                placeHolder="profile name"
              />
            </div>
          </td>

          <td>
            <div class="control" v-if="adding">
              <input
                class="input"
                type="time"
                v-model="start"
                min="00:00"
                max="23:59"
                size="2"
              />
            </div>
          </td>

          <td>
            <div class="control" v-if="adding">
              <input
                class="input"
                type="number"
                min="0"
                max="24"
                v-model="duration"
                size="2"
              />
            </div>
          </td>

          <td>
            <div class="field is-grouped">
              <div class="control has-icons-left" v-if="adding">
                <input
                  class="input"
                  type="number"
                  v-model="lampontemperature"
                  :min="tempMin"
                  :max="tempMax"
                  step="0.1"
                  size="4"
                />
                <span class="icon is-left">
                  <font-awesome-icon icon="thermometer-half" class="is-left" />
                </span>
              </div>

              <div class="control has-icons-left" v-if="adding">
                <input
                  class="input"
                  type="number"
                  v-model="lamponhumidity"
                  min="0"
                  max="100"
                  size="2"
                />
                <span class="icon is-left">
                  <font-awesome-icon icon="tint" />
                </span>
              </div>
            </div>
          </td>

          <td>
            <div class="field is-grouped">
              <div class="control has-icons-left" v-if="adding">
                <input
                  class="input"
                  type="number"
                  v-model="lampofftemperature"
                  :min="tempMin"
                  :max="tempMax"
                  step="0.1"
                  size="4"
                />
                <span class="icon is-left">
                  <font-awesome-icon icon="thermometer-half" />
                </span>
              </div>
              <div class="control has-icons-left" v-if="adding">
                <input
                  class="input"
                  type="number"
                  v-model="lampoffhumidity"
                  min="0"
                  max="100"
                  size="2"
                />
                <span class="icon is-left">
                  <font-awesome-icon icon="tint" />
                </span>
              </div>
            </div>
          </td>

          <td>
            <add-controls
              @on-add="addable"
              @on-save="save"
              @on-cancel="cancel"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapGetters, mapActions } from "vuex";
import { Profile } from "@/store/profiles/types";
import ProfileRow from "@/components/ProfileRow.vue";
import AddControls from "@/components/AddControls.vue";
import { celsius2fahrenheit, fahrenheit2celsius } from "../../shared/utils";

const Profiles = Vue.extend({
  props: {
    units: String
  },

  data() {
    const on = this.units === "C" ? 23 : celsius2fahrenheit(23);
    const off = this.units === "C" ? 18 : celsius2fahrenheit(18);

    return {
      profile: "",
      timezone: "America/New_York",
      start: "08:00",
      duration: 12,
      lampontemperature: on,
      lamponhumidity: 25,
      lampofftemperature: off,
      lampoffhumidity: 25,
      adding: false
    };
  },

  components: {
    AddControls,
    ProfileRow
  },

  computed: {
    profilesName(): string {
      if (this.profilesCount === 1) {
        return "Profile";
      } else {
        return "Profiles";
      }
    },

    tempMin(): number {
      return this.units === "F" ? 50 : 15;
    },

    tempMax(): number {
      return this.units === "F" ? 80 : 30;
    },

    ...mapState("profiles", ["profiles"]),

    ...mapGetters("profiles", ["profilesCount"])
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
      if (this.units === "F") {
        profile.lampontemperature = fahrenheit2celsius(this.lampontemperature);
        profile.lampofftemperature = fahrenheit2celsius(
          this.lampofftemperature
        );
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
      const on = this.units === "C" ? 23 : celsius2fahrenheit(23);
      const off = this.units === "C" ? 18 : celsius2fahrenheit(18);

      this.profile = "";
      this.timezone = "America/New_York";
      this.start = "08:00";
      this.duration = 12;
      this.lampontemperature = on;
      this.lamponhumidity = 25;
      this.lampofftemperature = off;
      this.lampoffhumidity = 25;
      this.adding = false;
    },

    ...mapActions("profiles", ["add"])
  }
});
export default Profiles;
</script>
