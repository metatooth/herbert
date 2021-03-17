<template>
  <section class="section">
    <h2 id="zones" class="title">{{ zonesCount }} {{ zonesName }}</h2>
    <table class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Profile</th>
          <th>Updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <zone-row
          v-for="zone in zones"
          v-bind:key="zone.id"
          v-bind::units="units"
          v-bind:zone="zone"
        />
        <tr>
          <td>
            <div class="control" v-if="adding">
              <input
                class="input"
                type="text"
                v-model="nickname"
                placeHolder="zone name"
              />
            </div>
          </td>

          <td>
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
          </td>

          <td></td>

          <td>
            <add-controls @on-add="add" @on-save="save" @on-cancel="cancel" />
          </td>
        </tr>
      </tbody>
    </table>
    <button class="button is-info">
      <font-awesome-icon icon="sync" @click="$store.dispatch('getZones')" />
    </button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ZoneRow from "@/components/ZoneRow.vue";
import AddControls from "@/components/AddControls.vue";
import { mapState, mapGetters, mapActions } from "vuex";

const Zones = Vue.extend({
  props: {
    units: String
  },

  data() {
    return {
      nickname: "",
      profile: "",
      adding: false
    };
  },

  components: {
    AddControls,
    ZoneRow
  },

  computed: {
    zonesName(): string {
      if (this.$store.getters.zones.zonesCount === 1) {
        return "Zone";
      } else {
        return "Zones";
      }
    }
  },

  methods: {
    add(): void {
      this.adding = true;
    },

    save(): void {
      this.$store.dispatch("addZone", {
        nickname: this.nickname,
        profile: this.profile
      });
      this.nickname = "";
      this.profile = "";
      this.adding = false;
    },

    cancel(): void {
      this.nickname = "";
      this.profile = "";
      this.adding = false;
    }
  }
});

export default Zones;
</script>
