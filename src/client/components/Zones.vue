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
          v-for="zone in allZones"
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
                <select v-model="profileid">
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
      <font-awesome-icon icon="sync" @click="['zones/fetchData']" />
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
      profileid: 0,
      adding: false
    };
  },

  components: {
    AddControls,
    ZoneRow
  },

  computed: {
    zonesName(): string {
      if (this.zonesCount === 1) {
        return "Zone";
      } else {
        return "Zones";
      }
    },
    ...mapState("profiles", ["profiles"]),
    ...mapGetters("zones", ["allZones", "zonesCount"])
  },

  methods: {
    add(): void {
      this.adding = true;
    },

    save(): void {
      if (this.nickname && this.profileid) {
        this["zones/add"]({ nickname: this.nickname, profileid: this.profileid });
      }

      this.nickname = "";
      this.profileid = 0;
      this.adding = false;
    },

    cancel(): void {
      this.nickname = "";
      this.profileid = 0;
      this.adding = false;
    },

    ...mapActions(["zones/add", "zones/fetchData"])
  }
});

export default Zones;
</script>
