<template>
  <tr>
    <td>
      <a v-if="!editing" :href="linkToConfig">{{ zone.nickname }}</a>
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
      <div v-if="!editing">
        <div v-if="zone.parent">
          {{ zone.parent }}
        </div>
        <div v-else>
          <a :href="linkToConfig">no parent set</a>
        </div>
      </div>
      <div class="control" v-else>
        <div class="select">
          <select v-model="parentid">
            <option
              v-for="zone in zones"
              v-bind:key="zone.id"
              v-bind:value="zone.id"
            >
              {{ zone.nickname }}
            </option>
          </select>
        </div>
      </div>
    </td>
    <td>
      <timestamp :timestamp="zoneUpdatedAt" />
    </td>
    <td>
      <edit-controls
        @on-edit="edit"
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

const ZoneRow = Vue.extend({
  props: {
    zone: Object,
    profiles: Array,
    zones: Array
  },

  data() {
    return {
      nickname: this.zone.nickname,
      profileId: this.zone.profile_id,
      parentId: this.zone.parent_id,
      editing: false
    };
  },

  components: {
    Timestamp,
    EditControls
  },

  computed: {
    linkToConfig(): string {
      return "#" + this.zone.id + "config";
    },

    zoneUpdatedAt(): Date {
      return new Date(Date.parse(this.zone.updatedat));
    }
  },

  methods: {
    edit() {
      this.editing = true;
    },

    save() {
      const parent = this.zones.find(el => el.id === this.parentid);
      const profile = this.profiles.find(el => el.id === this.profileid);

      const zone = {
        id: this.zone.id,
        nickname: this.nickname,
        profileid: this.profileid,
        profile: profile.profile,
        parentid: this.parentid,
        parent: parent.nickname
      };

      this.$store.dispatch("editZone", zone);
      this.editing = false;
    },

    destroy() {
      this.$store.dispatch("removeZone", this.zone);
      this.editing = false;
    },

    cancel() {
      this.nickname = this.zone.nickname;
      this.profileid = this.zone.profileid;
      this.parentid = this.zone.parentid;
      this.editing = false;
    }
  }
});

export default ZoneRow;
</script>
