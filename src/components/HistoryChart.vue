<template>
  <div class="chart-container" v-resize="onResize" ref="chartWrapper" :style="{ height: '100%' }">

    <highcharts v-if='true' ref="priceGraph" :constructorType="'stockChart'" :options="chartOptions"></highcharts>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";

// Access the trader store and reactive priceHistory
const { priceHistory } = storeToRefs(useTraderStore());
// Define initial min and max for x-axis

// Reference to the chart component
const chartRef = ref(null);
const priceGraph = ref(null);
const chartHeight = ref(0);
const chartWrapper = ref(null);
// Define reactive chart options
import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();
console.debug('smAndDown', smAndDown.value)
// make computed: show chart title if not smAndDown
const chartTitle = ref("Price History")
const x = 1; // For the last 60 minutes

const pointStart = Date.now() - x * 60 * 1000; // x minutes ago
const pointInterval = 10 * 1000; // One minute intervals


const chartOptions = reactive({

  time: {
    useUTC: false
  },
  chart: {
    // height: '300px', // Allow dynamic height
    // backgroundColor: '#2b2b2b', // Dark background color
    style: {
      fontFamily: 'sans-serif',
    },
  },
  title: {
    text: chartTitle.value,
    style: {
      // color: "#FFFFFF", // Title color in light text
    },
  },
  xAxis: {
    type: "datetime",
    // min: initialMin,
    // max: initialMax,
    // ordinal: true,
    // gridLineColor: "#505053", // Darker grid lines
    labels: {
      style: {
        // color: "#E0E0E3", // Light text for labels
      },
    },
    // lineColor: "#707073", // Axis line color
    // tickColor: "#707073", // Tick color
  },
  yAxis: {
    // gridLineColor: "#505053", // Darker grid lines
    labels: {
      style: {
        // color: "#E0E0E3", // Light text for labels
      },
    },
    title: {
      text: "Price",
      style: {
        // color: "#E0E0E3", // Light text for axis title
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
    inputEnabled: false,
    allButtonsEnabled: true,
    buttons: [
      {
        type: "millisecond",
        count: 5,
        text: "5sec",
        title: "View 5 sec",
      },
      {
        type: "all",
        count: 1,
        text: "all",
        title: "View all",
      },
    ],
    enabled: true,
    selected: 0,
  },
  series: [
    {      pointStart: pointStart,
      pointInterval: pointInterval,
      dataLabels: {
        useHTML: true,
        format: `
  <span class='myspan' style="
      width: 40px; 
      height: 20px; 
      background-color: orange!important; 
      border: 1px solid blue; 
      border-radius: 5px; 
      text-align: center; 
      line-height: 20px; 
      font-size: 12px!important; 
      font-weight: bold;
      color: black; 
      z-index:100000!important; ;
      margin-left: -20px;">
    {point.y}
  </span>
`,
        enabled: true,
        formatter() {
          let points = this.series.points;
          if (this.x === points[points.length - 1].x) {
            return this.y
          }
        }
      },
      name: "Price",
      data: priceHistory.value,
      marker: {
        enabled: true,
        radius: 6, // Large dots
        // fillColor: "#FF5733", // Orange dots
      },
      // lineColor: "#FF5733", // Line connecting dots
    },
  ],
  legend: {
    itemStyle: {
      // color: "#E0E0E3", // Light text for legend
    },
    itemHoverStyle: {
      // color: "#FFFFFF", // Lighter text on hover
    },
    itemHiddenStyle: {
      // color: "#606063", // Muted text for hidden items
    },
  },
  tooltip: {
    // backgroundColor: "#333333", // Dark tooltip background
    style: {
      // color: "#F0F0F0", // Light text for tooltip
    },
  },
});

// Watch priceHistory for updates
watch(priceHistory, (newHistory) => {
  // if (chartOptions.series[0]) {

  chartOptions.series[0].data = newHistory;
  // chartOptions.series[0].points[0].label = "Your Label Text";
  // console.debug('at least do we reach here at least??!')
  //   // Reset x-axis range to initial values
  if (priceGraph.value?.chart) {

    // initialMin.value = Date.now();
    // initialMax.value=  Date.now()+2*60*1000
    // priceGraph.value.chart.xAxis[0].setExtremes(initialMin.value, initialMax.value);
  }
  // }
}, { deep: true });

// Ensure the chart resizes to fit its container
onMounted(async () => {
  await nextTick(); // Ensure the DOM is updated before accessing the chart
  onResize();
  // this.chartHeight = this.$refs.chartWrapper.clientHeight - 50;
  // if (chartRef.value?.chart) {
  //   chartRef.value.chart.reflow(); // Adjust chart size to match its container
  // }
});

const onResize = () => {

  if (chartWrapper.value.offsetHeight < 250 || chartWrapper.value.offsetWidth < 600) {
    chartTitle.value = null;
    priceGraph.value.chart.title.update({ text: chartTitle.value });
  }
  if (chartWrapper.value && priceGraph.value) {
    chartHeight.value = chartWrapper.value.offsetHeight;

    // Wait for DOM updates before resizing chart
    requestAnimationFrame(() => {

      priceGraph.value.chart.setSize(null, chartHeight.value);
      priceGraph.value.chart.reflow();
    });
  }
};


</script>

<style>
.chart-container {
  height: 100% !important;
  /*calc(50vh - 100px); /* Adjust height dynamically
  /*width: 100%; /* Full width of the parent container */
}
.myspan{
  background-color: white!important;
  font-size: 16px!important;
  z-index: 100000!important;
  padding:0.5px!important;
}
</style>