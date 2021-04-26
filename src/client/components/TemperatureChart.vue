<template>
  <div>
    <chart
      :id="id"
      v-bind:data="display"
      title="Temperature"
      v-bind:label="label"
      v-bind:suggestedMin="suggestedMin"
      v-bind:suggestedMax="suggestedMax"
      v-bind:stepSize="stepSize"
      v-bind:units="settings.units"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Chart from "@/components/Chart.vue";
import "chartjs-adapter-date-fns";

const TemperatureChart = Vue.extend({
  props: {
    id: { type: String },
    data: { type: Array }
  },

  data() {
    return {
      display: [],
      stepSize: 0.5,
      minmax: [100, 0]
    };
  },

  components: {
    Chart
  },

  computed: {
    label() {
      if (this.settings.units === "C") {
        return "Celsius (°C)";
      } else if (this.settings.units === "F") {
        return "Fahrenheit (°F)";
      }

      return "Kelvin (°K)";
    },

    suggestedMin() {
      if (this.minmax[0] === 0) {
        this.calcminmax();
      }
      return this.minmax[0];
    },

    suggestedMax() {
      if (this.minmax[1] === 100) {
        this.calcminmax();
      }
      return this.minmax[1];
    },

    ...mapGetters("settings", ["settings"])
  },

  watch: {
    data() {
      this.display = [];
      let x, y;
      this.data.forEach(d => {
        x = d.x;
        if (this.settings.units === "C") {
          y = d.y;
        } else if (this.settings.units === "F") {
          y = (d.y * 9) / 5 + 32;
        } else {
          y = d.y + 273.15;
        }

        if (y < this.minmax[0]) {
          this.minmax[0] = y;
        }

        if (y > this.minmax[1]) {
          this.minmax[1] = y;
        }

        this.display.push({ x: x, y: y });
      });
    }
  },

  methods: {
    calcminmax() {
      console.log("at calcminmax");
      this.data.forEach(d => {
        if (d.y < this.minmax[0]) {
          this.minmax[0] = d.y;
        }

        if (d.y > this.minmax[1]) {
          this.minmax[1] = d.y;
        }
      });
    }
  }
});
export default TemperatureChart;
</script>
