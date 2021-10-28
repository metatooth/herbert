<template>
  <tr>
    <td>
      <router-link
        class="has-text-weight-bold"
        :to="{
          name: 'zone',
          hash: linkto,
          params: { id: zone.id, units: units }
        }"
      >
        {{ zone.nickname }}
      </router-link>
    </td>
    <td>
      <div class="control">
        <div class="tags has-addons">
          <span class="tag has-background-black-bis is-medium" :style="text">
            <font-awesome-icon icon="lightbulb" />
          </span>
          <span class="tag has-text-black-bis is-medium" :style="background">
            {{ zone.profile.profile }}
          </span>
        </div>
      </div>
    </td>
    <td>
      <zone-actual :zone="zone" :units="settings.units" />
    </td>
    <td>
      <timestamp
        :timestamp="new Date(Date.parse(zone.updatedat))"
        :readable="true"
      />
    </td>
    <td>
      <button class="button" :class="statusClass" @click="toggle">
        <span class="icon">
          <font-awesome-icon :icon="statusIcon" />
        </span>
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { Zone } from "@/store/zones/types";
import ZoneActual from "@/components/ZoneActual.vue";
import Timestamp from "@/components/Timestamp.vue";

const ZoneRow = Vue.extend({
  props: {
    zone: Zone,
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
    ZoneActual
  },

  computed: {
    background() {
      if (this.zone.isDay(new Date())) {
        return "background-color: #ffe08a";
      } else {
        return "background-color: #7a7a7a";
      }
    },

    linkto(): string {
      return `#zone-details-${this.zone.id}`;
    },

    text() {
      if (this.zone.isDay(new Date())) {
        return "color: #ffe08a";
      } else {
        return "color: #7a7a7a";
      }
    },

    statusClass() {
      if (this.zone.active) {
        return "has-text-success";
      } else {
        return "has-text-info";
      }
    },

    statusIcon() {
      if (this.zone.active) {
        return "toggle-on";
      } else {
        return "toggle-off";
      }
    },

    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("settings", ["settings"])
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

    toggle() {
      const zone = {
        ...this.zone,
        active: !this.zone.active
      };

      this.edit(zone);
    },

    ...mapActions("zones", ["edit", "remove"])
  }
});

export default ZoneRow;
</script>
