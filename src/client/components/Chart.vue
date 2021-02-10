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
    dataset: { type: Array },
    title: { type: String },
    label: { type: String },
    suggestedMin: { type: Number },
    suggestedMax: { type: Number }
  },

  watch: {
    dataset() {
      console.log("dataset", this.dataset);
      console.log("get element by id", this.id);
      const ctx = document.getElementById(this.id);
      console.log("context", ctx);
      new ChartJS(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              data: this.dataset,
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
        }
      });
    }
  }
});
export default Chart;
</script>
