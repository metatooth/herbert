<template>
  <section class="section">
    <h2 class="title">{{ profiles.length }} {{ profilesName }}</h2>
    <table class="table is-full-width">
      <thead>
        <tr>
          <th class="has-background-primary">ID</th>
          <th colspan="2" class="has-background-light">Lamps</th>
          <th class="has-background-warning">
            <font-awesome-icon icon="sun" />
          </th>
          <th class="has-background-info">
            <font-awesome-icon icon="moon" />
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <profile-row
          v-for="profile in profiles"
          v-bind:key="profile.id"
          v-bind:units="units"
          v-bind:profile="profile"
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
            <div class="field">
              <div class="control has-icons-left" v-if="adding">
                <input
                  class="input"
                  type="number"
                  v-model="lampOnTemperature"
                  :min="tempMin"
                  :max="tempMax"
                  size="2"
                />
                <span class="icon is-left">
                  <font-awesome-icon icon="thermometer-half" class="is-left" />
                </span>
              </div>

              <div class="control has-icons-left" v-if="adding">
                <input
                  class="input"
                  type="number"
                  v-model="lampOnHumidity"
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
            <div class="field">
              <div class="control has-icons-left" v-if="adding">
                <input
                  class="input"
                  type="number"
                  v-model="lampOffTemperature"
                  :min="tempMin"
                  :max="tempMax"
                  size="2"
                />
                <span class="icon is-left">
                  <font-awesome-icon icon="thermometer-half" />
                </span>
              </div>
              <div class="control has-icons-left" v-if="adding">
                <input
                  class="input"
                  type="number"
                  v-model="lampOffHumidity"
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
            <add-controls @on-add="add" @on-save="save" @on-cancel="cancel" />
          </td>
        </tr>
      </tbody>
    </table>
    <button class="button is-info">
      <font-awesome-icon icon="sync" @click="$store.dispatch('getProfiles')" />
    </button>    
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ProfileRow from "@/components/ProfileRow.vue";
import AddControls from "@/components/AddControls.vue";

const Profiles = Vue.extend({
  props: {
    profiles: Array,
    units: String
  },

  data() {
    return {
      profile: "",
      start: "08:00",
      duration: 12,
      lampOnTemperature: 65.0,
      lampOnHumidity: 21,
      lampOffTemperature: 55.0,
      lampOffHumidity: 21,
      adding: false
    };
  },

  components: {
    AddControls,
    ProfileRow
  },

  mounted() {
    console.log("profiles mounted, adjust min/max for temperature inputs");
  },

  watch: {
    units(val) {
      console.log("profile units is now", val);
      if (val === "F") {
        this.lampOnTemperature = (this.lampOnTemperature * 9) / 5 + 32;
        this.lampOffTemperature = (this.lampOffTemperature * 9) / 5 + 32;
      } else {
        this.lampOnTemperature = ((this.lampOnTemperature - 32) * 5) / 9;
        this.lampOffTemperature = ((this.lampOffTemperature - 32) * 5) / 9;
      }
    }
  },

  computed: {
    profilesName(): string {
      if (this.profiles.length === 1) {
        return "Profile";
      } else {
        return "Profiles";
      }
    }
  },

  methods: {
    add(): void {
      this.adding = true;
    },

    cancel(): void {
      this.clear();
      this.adding = false;
    },

    clear(): void {
      this.profile = "";
      this.start = "08:00";
      this.duration = 12;

      if (this.units === "F") {
        this.lampOnTemperature = 65.0;
        this.lampOffTemperature = 55.0;
      } else {
        this.lampOnTemperature = 18.3;
        this.lampOffTemperature = 12.8;
      }

      this.lampOnHumidity = 21;
      this.lampOffHumidity = 21;
    },

    save(): void {
      const start = this.start.split(":");
      console.log(start);
      let hourInt = parseInt(start[0]) + 5; // WARNING!
      if (hourInt > 24) {
        hourInt = hourInt - 24;
      }
      let hourString;
      if (hourInt < 10) {
        hourString = "0" + hourInt;
      } else {
        hourString = hourInt.toString();
      }
      console.log(hourInt);
      console.log(hourString);
      let lampOn = this.lampOnTemperature;
      let lampOff = this.lampOffTemperature;

      if (this.units === "F") {
        lampOn = ((lampOn - 32) * 5) / 9;
        lampOff = ((lampOff - 32) * 5) / 9;
      }
      const profile = {
        profile: this.profile,
        start: `${hourString}:${start[1]}`,
        duration: this.duration,
        lampOnTemperature: lampOn,
        lampOnHumidity: this.lampOnHumidity,
        lampOffTemperature: lampOff,
        lampOffHumidity: this.lampOffHumidity
      };

      this.$store.dispatch("addProfile", profile);

      this.clear();

      this.adding = false;
    }
  }
});

export default Profiles;
</script>
