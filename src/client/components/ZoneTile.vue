<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">
        <span>
          <router-link
            :to="{
                 name: 'zone',
                 hash: linkto,
                 params: { id: zone.id  }
                 }"
            >
            {{ zone.nickname }}
          </router-link>
        </span>
        <button class="button is-small" :class="statusClass" @click="toggle">
          <span class="icon">
            <font-awesome-icon :icon="statusIcon" />
          </span>
        </button>
  </p>
  <div class="content">
  <span>{{ zone.profile.profile }}</span>
</div>
      <div class="content">
        <zone-actual :zone="zone" :units="settings.units" />
      </div>
      <div class="content">
        <timestamp :timestamp="lastupdate" :readable="readable" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { Zone } from "@/store/zones/types";
import ZoneActual from "@/components/ZoneActual.vue";
import Timestamp from "@/components/Timestamp.vue";

const ZoneTile = Vue.extend({
  props: {
    zone: Zone
  },

  data() {
    return {
      readable: true,
      editable: false
    };
  },
  
  components: {
    Timestamp,
    ZoneActual
  },

  computed: {
    linkto(): string {
      return `#zone-details-${this.zone.id}`;
    },

    lastupdate() {
      let last = null;
      this.zone.meters.forEach((meter) => {
        const updatedat = new Date(Date.parse(meter.updatedat));
        if (last === null || updatedat > last) {
          last = updatedat;
        }
      });
      return last;
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
    
    ...mapGetters("settings", ["settings"])
  },

  methods: {
    toggle() {
      const zone = {
        ...this.zone,
        active: !this.zone.active
      };

      this.edit(zone);
    }

    ...mapActions("zones", ["edit"])
  }
});

export default ZoneTile;
</script>
