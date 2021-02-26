<template>
  <section class="section">
    <h2 id="zones" class="subtitle">{{ zones.length }} {{ zonesName }}</h2>
    <table class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Profile</th>
          <th>Parent</th>
          <th>Updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <zone-row
          v-for="zone in zones"
          :key="zone.id"
          :units="units"
          v-bind:zone="zone"
        />
        <tr>
          <td>
            <div class="field">
              <div class="control" v-if="adding">
                <input
                  class="input"
                  type="text"
                  v-model="name"
                  placeHolder="zone name"
                />
              </div>
            </div>
          </td>

          <td>
            <div class="field">
              <div class="control" v-if="adding">
                <div class="select">
                  <select v-model="profile">
                    <option
                      v-for="profile in profiles"
                      :key="profile.id"
                      :value="profile.id"
                    >
                      {{ profile.profile }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </td>

          <td>
            <div class="field">
              <div class="control" v-if="adding">
                <div class="select">
                  <select v-model="parent">
                    <option
                      v-for="zone in zones"
                      :key="zone.id"
                      :value="zone.id"
                    >
                      {{ zone.nickname }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </td>

          <td></td>

          <td>
            <div class="field is-grouped">
              <div class="control" v-if="!adding">
                <button class="button" @click="adding = true">
                  <font-awesome-icon icon="plus" />
                  <span>Add</span>
                </button>
              </div>
              <div class="control" v-if="adding">
                <button class="button" @click="save()">
                  <font-awesome-icon icon="check" />
                  <span>Save</span>
                </button>
              </div>
              <div class="control" v-if="adding">
                <button class="button" @click="cancel()">
                  <font-awesome-icon icon="times" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ZoneRow from "@/components/ZoneRow.vue";

const Zones = Vue.extend({
  props: {
    zones: Array,
    profiles: Array,
    units: String
  },

  data() {
    return {
      name: "",
      profile: "",
      parent: "",
      adding: false
    };
  },

  components: {
    ZoneRow
  },

  computed: {
    zonesName(): string {
      if (this.zones.length === 1) {
        return "Zone";
      } else {
        return "Zones";
      }
    }
  },

  methods: {
    save(): void {
      const zone = {
        nickname: this.name,
        profile: this.profile,
        parent: this.parent
      };

      this.$emit("create-zone", zone);
      this.adding = false;
    },

    cancel(): void {
      this.name = "";
      this.profile = "";
      this.parent = "";
      this.adding = false;
    }
  }
});

export default Zones;
</script>
