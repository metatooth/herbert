<template>
  <section class="section">
    <h2 class="subtitle">{{ profiles.length }} {{ profilesName }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th class="has-background-primary">ID</th>
          <th class="has-background-light">Lamps</th>
          <th colspan="3" class="has-background-warning">
            <font-awesome-icon icon="sun" />
          </th>
          <th colspan="3" class="has-background-info">
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

const Profiles = Vue.extend({
  props: {
    profiles: Array,
    units: String
  },

  components: {
    ProfileRow
  },

  computed: {
    profilesName(): string {
      if (this.profiles.length === 1) {
        return "Profile";
      } else {
        return "Profiles";
      }
    }
  }
});

export default Profiles;
</script>
