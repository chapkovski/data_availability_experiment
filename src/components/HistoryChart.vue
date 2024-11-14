<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { Chart } from "highcharts-vue";
import HighCharts from "highcharts";
import StockCharts from "highcharts/modules/stock";
import HighchartsNoData from "highcharts/modules/no-data-to-display";

const traderStore = useTraderStore();
const { history } = storeToRefs(traderStore);
const priceGraph = ref(null);

const original_options = {
  chart: {
    backgroundColor: '#2b2b2b',
    style: {
      fontFamily: 'sans-serif',
      color: '#E0E0E3'
    },
  },
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
        count: 60,
        text: '1m'
      },
    ],
    selected: 0, // Index of the button to select by default (0 is the first button, "1m" in this case)
    inputEnabled: false // Disables the date range input fields
  },
  tooltip: {
    backgroundColor: '#333333',
    style: {
      color: '#F0F0F0',
    },
    pointFormat: 'Open: {point.open}<br>High: {point.high}<br>Low: {point.low}<br>Close: {point.close}',
  },
  
  yAxis: {
    gridLineColor: '#505053',
    labels: {
      style: {
        color: '#E0E0E3',
      },
    },
    title: {
      style: {
        color: '#E0E0E3',
      },
    },
  },
  title: {
    text: 'Transaction Price Chart',
    style: {
      color: '#E0E0E3',
    },
  },
  time: {
    useUTC: false,
  },
  series: [
    {
      name: 'Price',
      type: 'candlestick',
      data: history.value.map(item => [
        new Date(item.timestamp).getTime(), // X value (timestamp in milliseconds)
        item.open, // Open price
        item.high, // High price
        item.low,  // Low price
        item.close // Close price
      ]),
    },
  ],
  lang: {
    noData: 'No data to display',
  },
  noData: {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#E0E0E3',
    },
  },
  plotOptions: {
    candlestick: {
      color: '#d32f2f', // Color for falling candlesticks
      upColor: '#4caf50', // Color for rising candlesticks
      lineColor: '#333333',
      upLineColor: '#333333',
      dataGrouping: {
      enabled: true,
      units: [
        ['minute', [1, 5, 15, 30]], // Group by 1, 5, 15, or 30 minutes
    
      ]
    },
    },
  },
};

const chartOptions = reactive(original_options);

watch(
  history,
  (newHistory) => {
    const chartSeries = priceGraph.value?.chart.series[0];
    if (chartSeries && newHistory.length) {
      const latestPoint = newHistory[newHistory.length - 1];
      chartSeries.addPoint([
        new Date(latestPoint.timestamp).getTime(),
        latestPoint.open,
        latestPoint.high,
        latestPoint.low,
        latestPoint.close,
      ], true, false); // Update chart with new point without shifting
    }
  },
  { deep: true }
);

onMounted(async () => {
  
  console.debug("Price graph mounted");
  console.debug(history.value);
  await nextTick();
  //   priceGraph.value.chart.setSize(100, 200);
  //   priceGraph.value.chart.reflow();
});

StockCharts(HighCharts);
HighchartsNoData(HighCharts);
</script>

<script>
export default {
  components: {
    highcharts: Chart,
  },
};
</script>

<template>
  <v-btn @click="traderStore.addCurrentDataPoint()" v-if="false">AddNewPoint</v-btn>
  <div style="width: 100%">
    <highcharts
      ref="priceGraph"
      :constructor-type="'stockChart'"
      :options="chartOptions"
      style="height: 300px"
    >
    </highcharts>
  </div>
</template>

<style scoped></style>