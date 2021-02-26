<template>
  <div :id="anchor" class="tile is-6">
    <div class="card">
      <div class="card-content">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="selectedNickname"
              placeHolder="change me"
              :disabled="!editing"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Profile</label>
          <div class="control">
            <div class="select">
              <select v-model="selectedProfile" :disabled="!editing">
                <option
                  v-for="profile in profiles"
                  :key="profile.id"
                  :value="profile.profile"
                >
                  {{ profile.profile }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field is-grouped is-grouped-right">
          <div class="control" v-if="!editing">
            <button class="button is-warning" @click="editing = true">
              <font-awesome-icon icon="pencil-alt" />
            </button>
          </div>
          <div class="control" v-if="editing">
            <button class="button is-primary" @click="save()">
              <font-awesome-icon icon="check-circle" />
            </button>
          </div>
          <div class="control" v-if="editing">
            <button class="button is-danger" @click="close()">
              <font-awesome-icon icon="times-circle" />
            </button>
          </div>
        </div>
      </div>

      <div class="card-content">
        <p class="card-header-subtitle">
          Status
        </p>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <timestamp :timestamp="timestamp" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Timestamp from "@/components/Timestamp.vue";

const ZoneCard = Vue.extend({
  props: {
    zone: { type: Object }
  },

  data() {
    return {
      selectedProfile: this.profile,
      selectedNickname: this.nickname,
      editing: false
    };
  },

  components: {
    Timestamp
  },

  computed: {
    anchor(): string {
      return this.id + "config";
    },

    temp(): number {
      if (this.units === "C") {
        return this.temperature;
      } else {
        return (this.temperature * 9) / 5 + 32;
      }
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    }
  },

  methods: {
    save() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL || "http://localhost:5000";

      const found: any = this.profiles.find(
        (element: any) => element.profile === this.selectedProfile
      );

      xhr.open(
        "PUT",
        `${url}/zones/${this.id}/?nickname=${this.selectedNickname}&profile_id=${found.id}`
      );

      xhr.onload = () => {
        console.log("RESPONSE", xhr.response);
      };

      xhr.send();

      this.editing = false;
    },

    close() {
      this.selectedNickname = this.nickname;
      this.selectedProfile = this.profile;
      this.editing = false;
    }
  }
});

export default ZoneCard;
</script>
