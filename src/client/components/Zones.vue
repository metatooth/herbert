<template>
  <section class="section">
    <div class="level">
      <span class="title">{{ zonesCount }} {{ zonesName }}</span>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical">
        <zone-tile
          v-for="zone in left"
          :key="zone.id"
          :zone="zone"
          />
      </div>
      <div class="tile is-3 is-vertical">
        <zone-tile
          v-for="zone in middle"
          :key="zone.id"
          :zone="zone"
          />
      </div>
      <div class="tile is-3 is-vertical">
        <zone-tile
          v-for="zone in right"
          :key="zone.id"
          :zone="zone"
          />
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
    zonesName(): string {
      if (this.zonesCount === 1) {
        return "Zone";
      } else {
        return "Zones";
      }
    },
    
    left() {
      const zones = [];
      for (let i = 0; i < this.zonesCount; i = i + 3) {
        if (this.zones[i]) {
          zones.push(this.zones[i]);
        }
      }
      return zones;
    },

    middle() {
      const zones = [];
      for (let i = 1; i < this.zonesCount; i = i + 3) {
        if (this.zones[i]) {
          zones.push(this.zones[i]);
        }
      }
      return zones;
    },
    
    right() {
      const zones = [];
      for (let i = 2; i < this.zonesCount; i = i + 3) {
        if (this.zones[i]) {
          zones.push(this.zones[i]);
        }
      }
      return zones;
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
