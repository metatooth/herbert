<script lang="ts">
import Vue from "vue";
import HerbertButton from "@/components/Button.vue";
import { mapGetters } from "vuex";
import { Zone } from "@/store/zones/types";

const SelectProfile = Vue.extend({
  components: {
    HerbertButton,
  },

  props: {
    label: string,
    zone: Zone,
  },

  emits: ["select-profile"],

  data() {
    return {
      selected: this.zone.profileid || 0,
    };
  },

  computed: {
    changed(): boolean {
      if (this.zone.profileid === this.selected) {
        return false;
      }

      return true;
    },

    ...mapGetters("profiles", ["profiles"]),
  },

  methods: {
    select() {
      this.$emit("select-profile", this.selected);
    },
  },
});

export default SelectProfile;
</script>

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
                  :key="profile.id"
                  :value="profile.id"
                >
                  {{ profile.profile }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <herbert-button
            :show="changed"
            label=""
            icon="check"
            @on-click="select"
          />
        </div>
      </div>
    </div>
  </div>
</template>
