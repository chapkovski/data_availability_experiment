<script setup>
import { reactive, watchEffect, ref } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { Chart as HighchartsChart } from "highcharts-vue";
import Highcharts from 'highcharts';

import AnnotationsModule from 'highcharts/modules/annotations';

AnnotationsModule(Highcharts);



const { chartData, midPoint } = storeToRefs(useTraderStore());
import { watch } from "vue";


const chartOptions = reactive({
  title: { text: "Current Order Book" },
  annotations: [{
    labels: [{
      point: { x: 0, y: 0 },
      text: 'Bids',
      backgroundColor: 'blue',
      style: {

        color: "white"
      }
    },
    {
      point: { x: 100000, y: 0 },
      text: 'Asks',
      backgroundColor: 'red',
      style: {

        color: "white"
      }
    }]
  }], // Add annotations to the chart
  xAxis: {
    allowDecimals: false,
    tickInterval: 1, // Sets the interval between ticks on the x-axis
    minPadding: 0.1, // Adds 10% padding on the left side of the x-axis
    maxPadding: 0.1,   // Adds 10% padding on the right side of the x-axis
    labels: {
      format: "{value:.2f}", // Rounds to two decimal places for xAxis labels
    },
    labels: {
      formatter: function () {
        return Math.round(this.value).toString(); // Round to nearest integer and convert to string
      }
    },
    plotBands: [{
      from: -Infinity, // Starting at the leftmost part of the chart
      to: 2000, // Change color up to the year 2000
      color: 'rgba(204, 204, 255, 0.5)', // Light blue background for the left side
    }, {
      from: 2000, // Starting from the year 2000
      to: Infinity, // Extending to the rightmost part of the chart
      color: 'rgba(255, 204, 204, 0.5)', // Light red background for the right side
    }],
    plotLines: [{
      color: 'red', // Color of the line
      width: 2, // Width of the line
      value: midPoint,
      dashStyle: 'dash', // Style of the line, e.g., solid, dash, dot
      label: {
        text: midPoint, // Label for the line
        align: 'right',
        x: -10,
        y: 100,
        style: {
          color: 'black',
          fontWeight: 'bold',
          fontSize: '12px',
          backgroundColor: 'white', // Sets background color
          padding: '3px' // Adds space around the text

        },

      }
    }]
  },
  yAxis: {
    labels: {
      format: "{value:.2f}", // Rounds to two decimal places for yAxis labels
    },
    title: { text: "Volume (n. of shares)" },
    min: 0,
  },
  chart: {
    type: "column",
    animation: false
  },

  credits: {
    enabled: false
  },
  series: chartData.value,
  plotOptions: {
    series: {
      animation: false
    },
    column: {
      animation: false,
      tooltip: {
        headerFormat: "{point.key:.2f}<br>",
        pointFormat: "{series.name}: <b>{point.y:.2f}</b>",
      },
      pointPadding: 0.01,
      borderColor: "#000000",
      borderWidth: 1,
      grouping: false,
      groupPadding: 0,
    },
  },
});

watch(chartData, (newChartData) => {

  chartOptions.series = newChartData.map(series => ({
    ...series,
    pointPlacement: series.name === "Bids" ? -0.5 : 0.5,

  }));
}, { deep: true, immediate: true });
watchEffect(() => {
  chartOptions.xAxis.plotBands = [{
    from: -Infinity,
    to: midPoint, // Dynamically use the midPoint for the 'to' property
    color: 'rgba(204, 204, 255, 0.5)', // Example color for the left side
  }, {
    from: midPoint, // Dynamically use the midPoint for the 'from' property
    to: Infinity,
    color: 'rgba(255, 204, 204, 0.5)', // Example color for the right side
  }];
});

</script>

<template>
  <div style="width: 100%">

    <highcharts-chart :constructor-type="'chart'" :options="chartOptions" style="height: 300px"
      :deepCopyOnUpdate="true"></highcharts-chart>
  </div>
</template>
