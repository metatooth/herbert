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
              v-for="pstate in profiles"
              v-bind:key="pstate.profile.id"
              v-bind:value="pstate.profile.id"
            >
              {{ pstate.profile.profile }}
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
import { mapGetters, mapActions } from "vuex";
import { Zone } from "@/store/zones/types";

const ZoneRow = Vue.extend({
  props: {
    zone: { type: Zone },
    units: String
  },

  data() {
    return {
      nickname: this.zone.nickname,
      profileid: this.zone.profileid,
      editing: false
    };
  },

  components: {
    Timestamp,
    EditControls
  },

  mounted() {
    console.log("zone row as profiles", this.profiles);
  },
 
  computed: {
    linkToConfig(): string {
      return "#" + this.zone.id + "config";
    },

    ...mapGetters("profiles", ["profiles"])
  },      

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      const zone = {
        id: this.zone.id,
        nickname: this.nickname,
        profileid: this.profileid
      };

      this.edit(zone);
      this.editing = false;
    },

    destroy() {
      this.remove(this.zone);
      this.editing = false;
    },

    cancel() {
      this.nickname = this.zone.nickname;
      this.profileid = this.zone.profileid;
      this.editing = false;
    },

    ...mapActions("zones", ["edit", "remove"])
  }
});

export default ZoneRow;
</script>
