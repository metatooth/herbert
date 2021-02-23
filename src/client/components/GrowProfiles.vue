<template>
  <section class="section">
    <h2 class="subtitle">Grow Profiles</h2>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Lamps</th>
          <th colspan="3" class="has-background-warning-light">
            <font-awesome-icon icon="sun" />
          </th>
          <th colspan="3" class="has-background-info-light">
            <font-awesome-icon icon="moon" />
          </th>
        </tr>
      </thead>
      <tbody>
        <profile-row
          v-for="profile in profiles"
          :key="profile.id"
          :units="units"
          v-bind="profile"
        />
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ProfileRow from "@/components/ProfileRow.vue";

const GrowProfiles = Vue.extend({
  props: {
    profiles: Array,
    units: String
  },

  components: {
    ProfileRow
  }
});

export default GrowProfiles;
</script>
