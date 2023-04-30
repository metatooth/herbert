<template>
  <nav class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <div class="content">
          <p class="title is-5">
            {{ meter.name }}
          </p>
          <p class="subtitle is-7">
            {{ meter.device }}
          </p>
        </div>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <p class="title">{{ temperature.toFixed(0) }}°</p>
      </div>
      <div class="level-item">
        <p class="title">{{ humidity.toFixed(0) }}%</p>
      </div>
      <div class="level-item">
        <button class="button has-text-info" @click="history">
          <span class="icon">
            <font-awesome-icon icon="history" />
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Meter } from "@/store/meters/types";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";
const MeterNarrow = Vue.extend({
  props: {
    meter: Meter,
  },

  computed: {
    temperature(): number {
      const temp = this.meter.temperature * 1;
      if (this.settings.units === "F") {
        return celsius2fahrenheit(temp);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(temp);
      }
      return temp;
    },

    humidity(): number {
      return this.meter.humidity * 100;
    },

    ...mapGetters("settings", ["settings"]),
  },

  methods: {
    history() {
      this.$router.push({
        name: "readings",
        params: { name: this.meter.nickname, device: this.meter.device },
      });
    },
  },
});

export default MeterNarrow;
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
