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
          <target
            icon="tint"
            :value="humidity"
            :precision="0"
            units="%"
          />
          <target
            icon="cloud"
            :value="vaporPressureDeficit"
            :precision="1"
            units="hPa"
          />
        </div>
        <div class="tags">
          <system
            name="blower"
            :status="blower"
          />
          <system
            name="dehumidifier"
            :status="dehumidifier"
          />
          <system
            name="heater"
            :status="heater"
          />
          <system
            name="humidifier"
            :status="humidifier"
          />
          <system
            name="lamp"
            :status="lamp"
          />
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
import Target from "Components/Target.vue";
import Timestamp from "Components/Timestamp.vue";
import System from "Components/System.vue";

import Vue from "vue";
import Component from "vue-class-component";

const ClientCardProps = Vue.extend({
  props: {
    id: {
      type: String,
      default: ''
    },
    units: {
      type: String,
      default: ''
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
    },
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
