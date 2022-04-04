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
    color: { type: String, default: "rgb(255, 119, 0)" },
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
      this.chart.data.datasets.push({
        data: val,
        fill: false,
        pointRadius: 0,
        spanGaps: true,
        tension: 0.2,
        borderColor: this.color,
        backgroundColor: this.color
      });

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
                parser: "yyyy-MM-dd HH:mm"
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
