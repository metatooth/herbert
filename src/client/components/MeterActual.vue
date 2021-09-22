<template>
  <div class="field is-grouped is-grouped-multiline">
    <target
      icon="thermometer-half"
      :value="temperature"
      :precision="1"
      :units="unitsWithDegree"
      color="success"
    />
    <target
      icon="tint"
      :value="humidity"
      :precision="0"
      units="%"
      color="success"
    />
    <target
      icon="cloud"
      :value="pressure"
      :precision="1"
      units="hPa"
      color="success"
    />
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

    pressure(): number {
      return this.meter.pressure / 1000;
    },

    unitsWithDegree(): string {
      return "°" + this.settings.units;
    },

    ...mapGetters("settings", ["settings"])
  }
});

export default MeterActual;
</script>
