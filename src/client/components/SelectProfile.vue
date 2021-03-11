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
import HerbertButton from "@/components/Button";

const SelectProfile = Vue.extend({
  props: {
    label: String,
    profile: Object,
    profiles: Array
  },

  components: {
    HerbertButton
  },

  data() {
    let id;
    if (this.profile) {
      id = this.profile.id;
    }

    return {
      selected: id,
      editing: false
    };
  },

  computed: {
    changed() {
      if (this.profile) {
        return this.profile.id !== this.selected;
      }
      return true;
    }
  },

  methods: {
    select() {
      this.$emit("select-profile", this.selected);
    }
  }
});

export default SelectProfile;
</script>
