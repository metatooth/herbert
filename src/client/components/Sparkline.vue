<template>
  <canvas :id="id" :width="width" :height="height" />
</template>

<script>
import Vue from "vue";
import ChartJS from "chart.js";
import "chartjs-adapter-date-fns";

const Sparkline = Vue.extend({
  props: {
    id: { type: String, default: "sparkline" },
    data: { type: Array },
    title: { type: String },
    label: { type: String },
    suggestedMin: { type: Number },
    suggestedMax: { type: Number },
    stepSize: { type: Number },
    range: { type: Number },
    width: { type: String, default: "300px" },
    height: { type: String, default: "50px" }
  },

  data() {
    return {
      chart: ChartJS
    };
  },

  mounted() {
    const ctx = document.getElementById(this.id);
    this.chart = new ChartJS(ctx, {
      type: "line",
      options: {
        responsive: false,
        legend: {
          display: false
        },
        title: {
          display: false
        },
        scales: {
          xAxes: [
            {
              display: false,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss"
              }
            }
          ],
          yAxes: [
            {
              display: false
            }
          ]
        }
      }
    });
  },

  watch: {
    data(val) {
      console.log("new data!", val);
      console.log("old", this.chart.data.datasets);

      this.chart.data.datasets.push({
        data: val,
        fill: false,
        pointRadius: 0,
        spanGaps: true,
        tension: 0.2,
        borderColor: "rgb(0,187,238)",
        backgroundColor: "rgb(0,187,238)"
      });

      console.log("new", this.chart.data.datasets);

      this.chart.options = {
        responsive: false,
        legend: {
          display: false
        },
        title: {
          display: false
        },
        scales: {
          xAxes: [
            {
              display: false,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss"
              }
            }
          ],
          yAxes: [
            {
              display: false
            }
          ]
        }
      };

      this.chart.update();
    }
  }
});
export default Sparkline;
</script>
