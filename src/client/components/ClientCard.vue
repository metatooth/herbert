<template>
  <div class="tile is-6">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ id }}
        </p>
      </header>
      <div class="card-content">
        <div class="tags are-medium">
          <target
            icon="thermometer-half"
            :value="temp"
            :precision="1"
            :units="unitsWithDegree"
          />
          <target icon="tint" :value="humidity" :precision="0" units="%" />
          <target
            icon="cloud"
            :value="vaporPressureDeficit"
            :precision="1"
            units="hPa"
          />
        </div>
        <div class="tags">
          <system name="blower" :status="blower" />
          <system name="dehumidifier" :status="dehumidifier" />
          <system name="heater" :status="heater" />
          <system name="humidifier" :status="humidifier" />
          <system name="lamp" :status="lamp" />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <timestamp :timestamp="timestamp" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Target from "@/components/Target.vue";
import Timestamp from "@/components/Timestamp.vue";
import System from "@/components/System.vue";
import { saturatedVaporPressure } from "../../shared/utils";

const ClientCard = Vue.extend({
  props: {
    id: {
      type: String,
      default: ""
    },
    units: {
      type: String,
      default: ""
    },
    temperature: {
      type: Number,
      default: -1
    },
    humidity: {
      type: Number,
      default: -1
    },
    blower: Boolean,
    dehumidifier: Boolean,
    heater: Boolean,
    humidifier: Boolean,
    lamp: Boolean,
    timestamp: {
      type: String,
      default: new Date()
    }
  },

  components: {
    Target,
    Timestamp,
    System
  },

  computed: {
    temp(): number {
      if (this.units === "C") {
        return this.temperature;
      } else {
        return (this.temperature * 9) / 5 + 32;
      }
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    },

    vaporPressureDeficit(): number {
      return (
        (saturatedVaporPressure(this.temperature - 0.6) -
          (this.humidity / 100) * saturatedVaporPressure(this.temperature)) /
        1000
      );
    }
  }
});

export default ClientCard;
</script>
