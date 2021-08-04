<template>
  <div class="field is-horizontal">
    <div class="field-label">
      <label class="label">Zones</label>
    </div>
    <div class="field-body">
      <div class="field has-addons">
        <div class="control">
          <div class="select">
            <select v-model="selected">
              <option
                v-for="zone in available"
                v-bind:key="zone.id"
                v-bind:value="zone.id"
              >
                {{ zone.nickname }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button class="button is-info" v-on:click="select">
            <font-awesome-icon icon="plus" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Zone } from "@/store/zones/types";

const SelectZone = Vue.extend({
  props: {
    exclude: Zone
  },
  data() {
    return {
      selected: ""
    };
  },

  computed: {
    available() {
      const available = [];
      this.zones.forEach(zone => {
        if (this.exclude.id !== zone.id) {
          available.push(zone);
        }
      });
      return available;
    },

    ...mapGetters("zones", ["zones"])
  },

  methods: {
    select() {
      this.$emit("select-zone", this.selected);
      this.selected = "";
    }
  }
});

export default SelectZone;
</script>
