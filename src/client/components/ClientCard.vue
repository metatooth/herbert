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
        <div class="field is-grouped">
          <target
            icon="thermometer-half"
            :value="temp"
            :precision="1"
            :units="unitsWithDegree"
          />
          <target icon="tint" :value="humidity" :precision="0" units="%" />
          <target icon="cloud" :value="pressure" :precision="1" units="hPa" />
        </div>
        <div class="tags has-addons">
          <system name="lamp" :status="lamp" />
          <system name="blower" :status="blower" />
          <system name="heater" :status="heater" />
          <system name="dehumidifier" :status="dehumidifier" />
          <system name="humidifier" :status="humidifier" />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <router-link
            :to="{
              name: 'readings',
              params: {
                environment: id,
                name: 'Main',
                meter: main,
                units: units
              }
            }"
          >
            MAIN
          </router-link>
        </div>
        <div class="card-footer-item">
          <router-link
            :to="{
              name: 'readings',
              params: {
                environment: id,
                name: 'Intake',
                meter: intake,
                units: units
              }
            }"
          >
            INTAKE
          </router-link>
        </div>
        <div class="card-footer-item">
          <timestamp :timestamp="timestamp" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Target from "@/components/Target.vue";
import Timestamp from "@/components/Timestamp.vue";
import System from "@/components/System.vue";

const ClientCard = Vue.extend({
  props: {
    id: {
      type: String,
      default: ""
    },
    nickname: {
      type: String,
      default: ""
    },
    main: {
      type: String,
      default: ""
    },
    intake: {
      type: String,
      default: ""
    },
    profile: {
      type: String,
      default: ""
    },
    temperature: {
      type: Number,
      default: -1
    },
    humidity: {
      type: Number,
      default: -1
    },
    pressure: {
      type: Number,
      default: -1
    },
    blower: Number,
    dehumidifier: Number,
    heater: Number,
    humidifier: Number,
    lamp: Number,
    units: {
      type: String,
      default: ""
    },
    timestamp: {
      type: Date,
      default: new Date()
    },
    profiles: Array
  },

  data() {
    return {
      selectedProfile: this.profile,
      selectedNickname: this.nickname,
      editing: false
    };
  },

  components: {
    Target,
    Timestamp,
    System
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

      const found = this.profiles.find(
        element => element.profile === this.selectedProfile
      );

      xhr.open(
        "PUT",
        `${url}/clients/${this.id}/?nickname=${this.selectedNickname}&profile_id=${found.id}`
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

export default ClientCard;
</script>
