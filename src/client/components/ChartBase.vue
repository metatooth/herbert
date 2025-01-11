<script lang="ts">
import "chartjs-adapter-date-fns";
import ChartJS from "chart.js";

export default {
  props: {
    id: { type: String, default: "" },
    type: { type: String, default: "scatter" },
    data: { type: Array<object>, default: "" },
    title: { type: String, default: "Chart Base" },
    label: { type: String, default: "Detail" },
    suggestedMin: { type: Number, default: 0 },
    suggestedMax: { type: Number, default: 100 },
    stepSize: { type: Number, default: 5 },
    range: { type: Number, default: 100 },
  },

  data() {
    return {
      chart: ChartJS,
    };
  },

  watch: {
    label(val) {
      this.chart.options = {
        title: {
          display: true,
          text: this.title,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              display: true,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: this.suggestedMin,
                suggestedMax: this.suggestedMax,
              },
              scaleLabel: {
                display: true,
                labelString: val,
              },
            },
          ],
        },
      };

      this.chart.update();
    },

    data(val) {
      this.chart.data.datasets.pop();

      this.chart.data.datasets.push({
        data: val,
        borderColor: "#00bbee",
        fill: false,
      });

      this.chart.options = {
        title: {
          display: true,
          text: this.title,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              display: true,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss",
                unit: "minute",
                unitStepSize: 5,
                displayFormats: {
                  minute: "HH:mm",
                },
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: this.suggestedMin,
                suggestedMax: this.suggestedMax,
              },
              scaleLabel: {
                display: true,
                labelString: this.label,
              },
            },
          ],
        },
      };

      this.chart.update();
    },
  },

  mounted() {
    const ctx = document.getElementById(this.id);

    this.chart = new ChartJS(ctx, {
      type: this.type,
      data: {
        datasets: [
          {
            data: this.data,
            borderColor: "#00bbee",
            fill: false,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: this.title,
        },
        legend: {
          display: false,
        },
        borderColor: "#00bbee",
        scales: {
          xAxes: [
            {
              display: true,
              type: "time",
              time: {
                parser: "yyyy-MM-dd HH:mm:ss",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: this.suggestedMin,
                suggestedMax: this.suggestedMax,
                stepSize: this.stepSize,
              },
              scaleLabel: {
                display: true,
                labelString: this.label,
              },
            },
          ],
        },
      },
    });
  },
};
</script>

<template>
  <canvas :id="id" width="400px" height="400px" />
</template>
