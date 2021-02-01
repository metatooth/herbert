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
            v-bind:units="unitsWithDegree">
          </target>
          <target
            icon="tint"
            v-bind:value="humidity"
            v-bind:precision="0"
            units="%">
          </target>
          <target
            icon="hammer"
            v-bind:value="vaporPressureDeficit"
            v-bind:precision="1"
            units="hPa">
          </target>
        </div>
        <div class="tags">
          <system
            name="blower"
            v-bind:status="blower">
          </system>
          <system
            name="dehumidifier"
            v-bind:status="dehumidifier">
          </system>
          <system
            name="heater"
            v-bind:status="heater">
          </system>
          <system
            name="humidifier"
            v-bind:status="humidifier">
          </system>
          <system
            name="lamp"
            v-bind:status="lamp">
          </system>
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <timestamp v-bind:updated_at="updated_at" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import Target from './Target.vue'
import Timestamp from './Timestamp.vue'
import System from './System.vue'

export default {
  name: 'Display',
  components: {
    Target,
    Timestamp,
    System
  },
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
    updated_at: String
  },
  computed: {
    temp () {
      if (this.units === 'C') {
        return this.temperature
      } else {
        return this.temperature * 9 / 5 + 32
      }
    },
    unitsWithDegree () {
      return '°' + this.units
    },
    vaporPressureDeficit () {
      return (this.saturatedVaporPressure(this.temperature - 0.6) -
              (this.humidity / 100 *
               this.saturatedVaporPressure(this.temperature))) / 1000
    }
  },
  methods: {
    saturatedVaporPressure (temp) {
      return 610.7 * Math.pow(10, 7.5 * temp / (temp + 237.3))
    }
  }
}
</script>

<style>
</style>
