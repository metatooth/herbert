<template>
  <div class="field is-horizontal">
    <div class="field-label">
      <label class="label">{{ label }}</label>
    </div>
    <div class="field-body">
      <div class="field has-addons">
        <div class="control">
          <div class="select">
            <select>
              <option
                v-for="ps in profiles"
                v-bind:key="ps.profile.id"
                v-bind:value="ps.profile.id"
              >
                {{ ps.profile.profile }}
              </option>
            </select>
          </div>
        </div>

        <herbert-button class="is-primary" label="" icon="check" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HerbertButton from "@/components/Button.vue";
import { mapState } from "vuex";

const SelectProfile = Vue.extend({
  props: {
    label: String,
    profileid: Number
  },

  components: {
    HerbertButton
  },

  computed: {
    ...mapState(["profiles/profiles"])
  }
});

export default SelectProfile;
</script>
