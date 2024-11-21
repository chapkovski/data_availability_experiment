<template>
  <div class="chart-container">
    <highcharts ref="chart" :constructorType="'stockChart'" :options="chartOptions"></highcharts>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";

// Access the trader store and reactive priceHistory
const { priceHistory } = storeToRefs(useTraderStore());
// Define initial min and max for x-axis
const initialMin = Date.now();
const initialMax = initialMin + 2 * 60 * 1000; // 2 minutes from now

// Reference to the chart component
const chartRef = ref(null);

// Define reactive chart options
const chartOptions = reactive({
  chart: {
    height: '300px', // Allow dynamic height
    backgroundColor: '#2b2b2b', // Dark background color
    style: {
      fontFamily: 'sans-serif',
    },
  },
  title: {
    text: "Price Chart",
    style: {
      color: "#FFFFFF", // Title color in light text
    },
  },
  xAxis: {
    type: "datetime",
    min: initialMin,
    max: initialMax,
    gridLineColor: "#505053", // Darker grid lines
    labels: {
      style: {
        color: "#E0E0E3", // Light text for labels
      },
    },
    lineColor: "#707073", // Axis line color
    tickColor: "#707073", // Tick color
  },
  yAxis: {
    gridLineColor: "#505053", // Darker grid lines
    labels: {
      style: {
        color: "#E0E0E3", // Light text for labels
      },
    },
    title: {
      text: "Price",
      style: {
        color: "#E0E0E3", // Light text for axis title
      },
    },
  },
  navigator: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  rangeSelector: {
    enabled: false,
    buttons: [
      {
        type: "second",
        count: 5,
        text: "1m",
      },
    ],
    inputEnabled: false, // Disables the date range input fields
  },
  series: [
    {
      name: "Price",
      data: priceHistory.value,
      marker: {
        enabled: true,
        radius: 6, // Large dots
        fillColor: "#FF5733", // Orange dots
      },
      lineColor: "#FF5733", // Line connecting dots
    },
  ],
  legend: {
    itemStyle: {
      color: "#E0E0E3", // Light text for legend
    },
    itemHoverStyle: {
      color: "#FFFFFF", // Lighter text on hover
    },
    itemHiddenStyle: {
      color: "#606063", // Muted text for hidden items
    },
  },
  tooltip: {
    backgroundColor: "#333333", // Dark tooltip background
    style: {
      color: "#F0F0F0", // Light text for tooltip
    },
  },
});

// Watch priceHistory for updates
watch(priceHistory, (newHistory) => {
  if (chartOptions.series[0]) {
    chartOptions.series[0].data = newHistory;

    // Reset x-axis range to initial values
    if (chartRef.value?.chart) {
      chartRef.value.chart.xAxis[0].setExtremes(initialMin, initialMax);
    }
  }
});

// Ensure the chart resizes to fit its container
onMounted(async () => {
  await nextTick(); // Ensure the DOM is updated before accessing the chart
  if (chartRef.value?.chart) {
    chartRef.value.chart.reflow(); // Adjust chart size to match its container
  }
});
</script>

<style scoped>
.chart-container {
  height: calc(50vh - 100px); /* Adjust height dynamically */
  width: 100%; /* Full width of the parent container */
}
</style>