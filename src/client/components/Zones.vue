<template>
  <section class="section">
    <div class="level">
      <span class="title">{{ activeCount }} {{ zonesName }}</span>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical">
        <zone-tile v-for="zone in left" :key="zone.id" :zone="zone" />
      </div>
      <div class="tile is-3 is-vertical">
        <zone-tile v-for="zone in middle" :key="zone.id" :zone="zone" />
      </div>
      <div class="tile is-3 is-vertical">
        <zone-tile v-for="zone in right" :key="zone.id" :zone="zone" />
        <div class="tile is-parent">
          <div class="tile is-child box">
            <p class="title">
              <add-controls
                @on-add="editable"
                @on-save="save"
                @on-cancel="cancel"
              />
            </p>
            <div class="content" v-if="editing">
              <div class="field is-grouped is-grouped-multiline">
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="nickname"
                    placeHolder="Name for zone"
                  />
                </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ZoneTile from "@/components/ZoneTile.vue";
import AddControls from "@/components/AddControls.vue";
import { mapGetters, mapActions } from "vuex";

const Zones = Vue.extend({
  props: {
    filter: String,
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
    ZoneTile
  },

  computed: {
    activeSet() {
      const active = this.zones.filter(el => {
        return el.nickname.match(this.filter);
      });
      return active.sort((a, b) => {
        return a.nickname > b.nickname;
      });
    },

    activeCount() {
      return this.activeSet.length;
    },

    zonesName(): string {
      if (this.activeCount === 1) {
        return "Zone";
      } else {
        return "Zones";
      }
    },

    left() {
      const zones = [];
      for (let i = 0; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          zones.push(this.activeSet[i]);
        }
      }
      return zones;
    },

    middle() {
      const zones = [];
      for (let i = 1; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          zones.push(this.activeSet[i]);
        }
      }
      return zones;
    },

    right() {
      const zones = [];
      for (let i = 2; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          zones.push(this.activeSet[i]);
        }
      }
      return zones;
    },

    ...mapGetters("profiles", ["profiles"]),

    ...mapGetters("zones", ["zones"])
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
