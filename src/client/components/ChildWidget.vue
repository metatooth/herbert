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
        <button class="delete" v-on:click="remove(child.id)" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import { mapGetters } from "vuex";

const ChildWidget = Vue.extend({
  props: {
    id: Number,
  },

  data() {
    return {
      child: Zone,
    };
  },

  mounted() {
    this.zones.forEach((zone) => {
      if (zone.id === this.id) {
        this.child = zone;
      }
    });
  },

  computed: {
    linkto(): string {
      return `#zone-details-${this.id}`;
    },

    ...mapGetters("zones", ["zones"]),
  },

  methods: {
    remove(child: number) {
      this.$emit("remove-child", child);
    },
  },
});

export default ChildWidget;
</script>
