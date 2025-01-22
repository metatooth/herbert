<script lang="ts">
import { mapGetters } from "vuex";

import { Zone } from "@client/store/zones/types";

export default {
  props: {
    id: Number,
  },

  emits: ["remove-child"],

  data() {
    return {
      child: new Zone(),
    };
  },

  computed: {
    linkto(): string {
      return `#zone-details-${this.id}`;
    },

    ...mapGetters("zones", ["zones"]),
  },

  mounted() {
    this.zones.forEach((zone) => {
      if (zone.id === this.id) {
        this.child = zone;
      }
    });
  },

  methods: {
    remove(child: number) {
      this.$emit("remove-child", child);
    },
  },
};
</script>

<template>
  <div class="control">
    <div class="tags has-addons">
      <span class="tag is-medium has-background-dark has-text-success">
        <font-awesome-icon icon="grip-horizontal" />
      </span>
      <span class="tag is-medium has-background-success has-text-dark">
        <router-link
          :to="{
            name: 'zone',
            hash: linkto,
            params: { id: child.id },
          }"
        >
          {{ child.nickname }}
        </router-link>
        <button class="delete" @click="remove(child.id)" />
      </span>
    </div>
  </div>
</template>
