<template>
  <tr>
    <td>
      <router-link
        v-if="!editing"
        :to="{ name: 'zone', params: { id: zone.id, units: units } }"
      >
        {{ zone.nickname }}
      </router-link>
      <div class="control" v-else>
        <input
          class="input"
          type="text"
          v-model="nickname"
          placeHolder="zone name"
        />
      </div>
    </td>
    <td>
      <div v-if="!editing">
        <div v-if="zone.profile">
          {{ zone.profile.profile }}
        </div>
        <div v-else>
          <a :href="linkToConfig">no profile set</a>
        </div>
      </div>
      <div class="control" v-else>
        <div class="select">
          <select v-model="profileid">
            <option
              v-for="profile in profiles"
              v-bind:key="profile.id"
              v-bind:value="profile.id"
            >
              {{ profile.profile }}
            </option>
          </select>
        </div>
      </div>
    </td>
    <td>
      <timestamp :timestamp="new Date(Date.parse(zone.updatedat))" />
    </td>
    <td>
      <edit-controls
        @on-edit="editable"
        @on-save="save"
        @on-destroy="destroy"
        @on-cancel="cancel"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import Timestamp from "@/components/Timestamp.vue";
import EditControls from "@/components/EditControls.vue";
import { mapState, mapActions } from "vuex";
import { Zone, ZoneState } from "@/store/zones/types";

const ZoneRow = Vue.extend({
  props: {
    state: ZoneState,
    units: String
  },

  data() {
    return {
      nickname: this.state.zone.nickname,
      profileid: this.state.zone.profileid,
      editing: false
    };
  },

  components: {
    Timestamp,
    EditControls
  },

  computed: {
    linkToConfig(): string {
      return "#" + this.state.zone.id + "config";
    },

    zone(): Zone {
      return this.state.zone;
    },

    ...mapState("profiles", ["profiles"])
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      const zone = {
        id: this.state.zone.id,
        nickname: this.nickname,
        profileid: this.profileid
      };

      this.edit(zone);
      this.editing = false;
    },

    destroy() {
      this.remove(this.state.zone);
      this.editing = false;
    },

    cancel() {
      this.nickname = this.state.zone.nickname;
      this.profileid = this.state.zone.profileid;
      this.editing = false;
    },

    ...mapActions("zones", ["edit", "remove"])
  }
});

export default ZoneRow;
</script>
