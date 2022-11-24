<template>
  <q-page class="row items-center justify-evenly">
    <LineChart v-bind="lineChartProps" />
    <LineChart v-bind="lineChartProps" />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { LineChart, useLineChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
Chart.register(...registerables);

const getData = computed<ChartData<"line">>(() => ({
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Bitcoin",
          data: [100, 140, 122, 144, 166, 177, 140],
          fill: false,
          borderColor: "#4bc0c0",
        },
      ],
    }));

    const options = computed<ChartOptions<"line">>(() => ({
      plugins: {
        legend: {
          display: false,
        },
      },
    }));

    const { lineChartProps } = useLineChart({
      options,
      chartData: getData,
    });

</script>
<style>
canvas {
  width: 431px !important;
  height: 289px !important;
}
</style>
