<template>
  <div class="field is-grouped">
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">{{ label }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <div class="select">
              <select v-model="selected">
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
        </div>
        <div class="field">
          <herbert-button
            class="is-primary"
            :show="changed"
            label=""
            @on-click="select"
            icon="check"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HerbertButton from "@/components/Button.vue";
import { mapGetters } from "vuex";
import { Zone, ZoneState } from "@/store/zones/types";

const SelectProfile = Vue.extend({
  props: {
    label: String,
    state: ZoneState
  },

  data() {
    return {
      selected: this.state.zone.profileid || 0
    };
  },

  components: {
    HerbertButton
  },

  computed: {
    zone(): Zone {
      return this.state.zone;
    },

    changed(): boolean {
      if (this.zone.profileid === this.selected) {
        return false;
      }

      return true;
    },

    ...mapGetters("profiles", ["profiles"])
  },

  methods: {
    select(profile: number) {
      this.$emit("select-profile", profile);
    }
  }
});

export default SelectProfile;
</script>
