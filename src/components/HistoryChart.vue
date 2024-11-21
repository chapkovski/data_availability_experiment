<template>
  <div class="chart-container">
    <highcharts
      ref="chart"
      :constructorType="'stockChart'"
      :options="chartOptions"
    ></highcharts>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";

// Access the trader store and reactive priceHistory
const { priceHistory } = storeToRefs(useTraderStore());

// Reference to the chart component
const chartRef = ref(null);

// Define reactive chart options
const chartOptions = reactive({
  chart: {
    height: '300px', // Allow dynamic height
  },
  
  // xAxis: {
  //   type: "datetime",
  //   labels: {
  //     style: { color: "#E0E0E3" },
  //   },
  // },
  navigator: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  rangeSelector: {
    enabled: true,
    buttons: [
      {
        type: 'second',
        count: 5,
        text: '1m'
      },
    ],
    // selected: 0, // Index of the button to select by default (0 is the first button, "1m" in this case)
    inputEnabled: false // Disables the date range input fields
  },
  series: [
    {
      name: "Price",
      data: priceHistory.value,
      marker: {
        enabled: true, // Ensure markers are visible
        radius: 6, // Make dots larger
        fillColor: "#FF0000", // Optional: Customize dot color
      },
    },
    
  ],
});

// Watch priceHistory for updates
watch(priceHistory, (newHistory) => {
  if (chartOptions.series[0]) {
    chartOptions.series[0].data = newHistory;
  }
});

// Ensure the chart resizes to fit its container
onMounted(async () => {
  await nextTick(); // Ensure the DOM is updated before accessing the chart
  if (chartRef.value?.chart) {
    priceGraph.value.chart.setSize('200px', '200px');
    chartRef.value.chart.reflow(); // Adjust chart size to match its container
  }
});
</script>

<style scoped>
.chart-container {
  height: calc(50hv - 100px); /* Full height of the parent container */
  width: 100%; /* Full width of the parent container */
}
</style>