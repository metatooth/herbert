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
                  v-for="pstate in profiles"
                  v-bind:key="pstate.profile.id"
                  v-bind:value="pstate.profile.id"
                >
                  {{ pstate.profile.profile }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <herbert-button
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
import { Zone } from "@/store/zones/types";

const SelectProfile = Vue.extend({
  props: {
    label: String,
    zone: Zone
  },

  data() {
    return {
      selected: this.zone.profileid || 0
    };
  },

  components: {
    HerbertButton
  },

  computed: {
    changed(): boolean {
      if (this.zone.profileid === this.selected) {
        return false;
      }

      return true;
    },

    ...mapGetters("profiles", ["profiles"])
  },

  methods: {
    select() {
      console.log("SELECT SELECT!");
      console.log("SELECT", this.selected);
      this.$emit("select-profile", this.selected);
    }
  }
});

export default SelectProfile;
</script>
