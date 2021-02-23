<template>
  <div>
    <chart
      :id="id"
      v-bind:data="display"
      title="Temperature"
      v-bind:label="label"
      v-bind:suggestedMin="suggestedMin"
      v-bind:suggestedMax="suggestedMax"
      v-bind:units="units"
    />
    <units-selector :units="units" @change-units="changeUnits" />
  </div>
</template>

<script>
import Vue from "vue";
import Chart from "@/components/Chart.vue";
import UnitsSelector from "@/components/UnitsSelector.vue";
import "chartjs-adapter-date-fns";

const TemperatureChart = Vue.extend({
  props: {
    id: { type: String },
    data: { type: Array }
  },

  data() {
    return {
      display: [],
      suggestedMin: 60,
      suggestedMax: 85,
      units: "F",
      label: "Fahrenheit (°F)"
    };
  },

  components: {
    Chart,
    UnitsSelector
  },

  watch: {
    data() {
      this.display = [];
      let x, y;
      this.data.forEach(d => {
        x = d.x;
        if (this.units == "F") {
          y = (d.y * 9) / 5 + 32;
        } else {
          y = d.y;
        }

        console.log("check", d.y, y);
        
        this.display.push({ x: x, y: y });
      });
    }
  },

  methods: {
    changeUnits(units) {
      console.log("units change", units);

      this.units = units;
      if (this.units === "C") {
        this.label = "Celsius (°C)";
        this.suggestedMin = 15;
        this.suggestedMax = 30;

        this.display = [];
        this.data.forEach(d => {
          console.log(d.x, d.y);
          this.display.push({ x: d.x, y: d.y });
        });
      } else {
        this.label = "Fahrenheit (°F)";
        this.suggestedMin = 60;
        this.suggestedMax = 85;

        this.display = [];
        let y;
        this.data.forEach(d => {
          y = (d.y * 9) / 5 + 32;
          console.log(d.x, d.y, y);
          this.display.push({ x: d.x, y: y });
        });
      }
    }
  }
});
export default TemperatureChart;
</script>
