<template>
  <div class="field is-grouped is-grouped-multiline">
    <target
      icon="thermometer-half"
      :value="temperature"
      units="°"
      color="#48c78e"
    />
    <target icon="tint" :value="humidity" units="%" color="#48c78e" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Meter } from "@/store/meters/types";
import Target from "@/components/Target.vue";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";

const MeterActual = Vue.extend({
  props: {
    meter: Meter
  },

  data() {
    return {
      ts: new Date()
    };
  },

  components: {
    Target
  },

  computed: {
    temperature(): number {
      if (this.settings.units === "F") {
        return celsius2fahrenheit(this.meter.temperature);
      } else if (this.settings.units === "K") {
        return celsius2kelvin(this.meter.temperature);
      }

      return this.meter.temperature / 1;
    },

    humidity(): number {
      return this.meter.humidity * 100;
    },

    ...mapGetters("settings", ["settings"])
  }
});

export default MeterActual;
</script>
