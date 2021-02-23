<template>
  <div class="tile is-6">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ id }}
        </p>
      </header>
      <div class="card-content">
        <div class="field is-grouped">
          <target
            icon="thermometer-half"
            :value="temp"
            :precision="1"
            :units="unitsWithDegree"
          />
          <target icon="tint" :value="humidity" :precision="0" units="%" />
          <target icon="cloud" :value="pressure" :precision="1" units="hPa" />
        </div>
        <div class="tags has-addons">
          <system name="lamp" :status="lamp" />
          <system name="blower" :status="blower" />
          <system name="heater" :status="heater" />
          <system name="dehumidifier" :status="dehumidifier" />
          <system name="humidifier" :status="humidifier" />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <router-link
            :to="{
              name: 'readings',
              params: {
                environment: id,
                name: 'Main',
                meter: main,
                units: units
              }
            }"
          >
            MAIN
          </router-link>
        </div>
        <div class="card-footer-item">
          <router-link
            :to="{
              name: 'readings',
              params: {
                environment: id,
                name: 'Intake',
                meter: intake,
                units: units
              }
            }"
          >
            INTAKE
          </router-link>
        </div>
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

const ClientCard = Vue.extend({
  props: {
    id: {
      type: String,
      default: ""
    },
    main: {
      type: String,
      default: ""
    },
    intake: {
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
    pressure: {
      type: Number,
      default: -1
    },
    blower: Number,
    dehumidifier: Number,
    heater: Number,
    humidifier: Number,
    lamp: Number,
    timestamp: {
      type: Date,
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
    }
  }
});

export default ClientCard;
</script>
