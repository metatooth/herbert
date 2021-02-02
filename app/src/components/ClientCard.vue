<template>
  <div class="tile is-6">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">{{ id }}</p>
      </header>
      <div class="card-content">
        <div class="tags are-medium">
          <target
            icon="thermometer-half"
            v-bind:value="temp"
            v-bind:precision="1"
            v-bind:units="unitsWithDegree"
          />
          <target
            icon="tint"
            v-bind:value="humidity"
            v-bind:precision="0"
            units="%"
          />
          <target
            icon="cloud"
            v-bind:value="vaporPressureDeficit"
            v-bind:precision="1"
            units="hPa"
          />
        </div>
        <div class="tags">
          <system name="blower" v-bind:status="blower" />
          <system name="dehumidifier" v-bind:status="dehumidifier" />
          <system name="heater" v-bind:status="heater" />
          <system name="humidifier" v-bind:status="humidifier" />
          <system name="lamp" v-bind:status="lamp" />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <timestamp v-bind:timestamp="timestamp" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Target from "./Target.vue";
import Timestamp from "./Timestamp.vue";
import System from "./System.vue";

import Vue from "vue";
import Component from "vue-class-component";

const ClientCardProps = Vue.extend({
  props: {
    id: String,
    units: String,
    temperature: Number,
    humidity: Number,
    blower: Boolean,
    dehumidifier: Boolean,
    heater: Boolean,
    humidifier: Boolean,
    lamp: Boolean,
    timestamp: String
  }
});

@Component({
  components: {
    Target,
    Timestamp,
    System
  }
})
export default class ClientCard extends ClientCardProps {
  get temp(): number {
    if (this.units === "C") {
      return this.temperature;
    } else {
      return (this.temperature * 9) / 5 + 32;
    }
  }

  get unitsWithDegree(): string {
    return "°" + this.units;
  }

  get vaporPressureDeficit(): number {
    return (
      (this.saturatedVaporPressure(this.temperature - 0.6) -
        (this.humidity / 100) * this.saturatedVaporPressure(this.temperature)) /
      1000
    );
  }

  saturatedVaporPressure(temp: number): number {
    return 610.7 * Math.pow(10, (7.5 * temp) / (temp + 237.3));
  }
}
</script>

<style></style>
