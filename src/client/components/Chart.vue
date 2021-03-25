<template>
  <canvas :id="id" width="400px" height="400px" />
</template>

<script>
import Vue from "vue";
import ChartJS from "chart.js";
import "chartjs-adapter-date-fns";

const Chart = Vue.extend({
  props: {
    id: { type: String },
    data: { type: Array },
    title: { type: String },
    label: { type: String },
    suggestedMin: { type: Number },
    suggestedMax: { type: Number },
    stepSize: { type: Number },
    range: { type: Number }
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
      data: {
        datasets: [
          {
            data: this.data,
            borderColor: "#00bbee",
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: this.title
        },
        legend: {
          display: false
        },
        borderColor: "#00bbee",
        scales: {
          xAxes: [
            {
              display: true,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss"
              }
            }
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: this.suggestedMin,
                suggestedMax: this.suggestedMax,
                stepSize: this.stepSize
              },
              scaleLabel: {
                display: true,
                labelString: this.label
              }
            }
          ]
        }
      }
    });
  },

  watch: {
    label(val) {
      this.chart.options = {
        title: {
          display: true,
          text: this.title
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              display: true,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss"
              }
            }
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: this.suggestedMin,
                suggestedMax: this.suggestedMax
              },
              scaleLabel: {
                display: true,
                labelString: val
              }
            }
          ]
        }
      };

      this.chart.update();
    },

    data(val) {
      this.chart.data.datasets.pop();

      this.chart.data.datasets.push({
        data: val,
        borderColor: "#00bbee",
        fill: false
      });

      this.chart.options = {
        title: {
          display: true,
          text: this.title
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              display: true,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss",
                unit: "minute",
                unitStepSize: 1,
                displayFormats: {
                  minute: "HH:mm"
                }
              }
            }
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: this.suggestedMin,
                suggestedMax: this.suggestedMax
              },
              scaleLabel: {
                display: true,
                labelString: this.label
              }
            }
          ]
        }
      };

      this.chart.update();
    }
  }
});
export default Chart;
</script>
