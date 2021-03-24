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
          v-for="szone in zones"
          v-bind:key="szone.zone.id"
          v-bind:units="units"
          v-bind:zone="szone.zone"
        />
        <tr>
          <td>
            <div class="control" v-if="editing">
              <input
                class="input"
                type="text"
                v-model="nickname"
                placeHolder="zone name"
              />
            </div>
          </td>

          <td>
            <div class="control" v-if="editing">
              <div class="select">
                <select v-model="profileid">
                  <option
                    v-for="pstate in profiles"
                    :key="pstate.profile.id"
                    :value="pstate.profile.id"
                  >
                    {{ pstate.profile.profile }}
                  </option>
                </select>
              </div>
            </div>
          </td>

          <td></td>

          <td>
            <add-controls
              @on-add="editable"
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
import ZoneRow from "@/components/ZoneRow.vue";
import AddControls from "@/components/AddControls.vue";
import { mapGetters, mapActions } from "vuex";

const Zones = Vue.extend({
  props: {
    units: String
  },

  data() {
    return {
      nickname: "",
      profileid: 0,
      editing: false
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
    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("zones", ["zones", "zonesCount"])
  },

  methods: {
    editable(): void {
      this.editing = true;
    },

    save(): void {
      if (this.nickname && this.profileid) {
        this.add({
          nickname: this.nickname,
          profileid: this.profileid
        });
      }

      this.nickname = "";
      this.profileid = 0;
      this.editing = false;
    },

    cancel(): void {
      this.nickname = "";
      this.profileid = 0;
      this.editing = false;
    },

    ...mapActions("zones", ["add"])
  }
});

export default Zones;
</script>
