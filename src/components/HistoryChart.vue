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
    selected: 1,
    enabled: false,
    inputStyle: {
      color: '#E0E0E3',
      backgroundColor: '#505053',
    },
    labelStyle: {
      color: '#E0E0E3',
    },
  },
  tooltip: {
    backgroundColor: '#333333',
    style: {
      color: '#F0F0F0',
    },
    pointFormat: 'Open: {point.open}<br>High: {point.high}<br>Low: {point.low}<br>Close: {point.close}',
  },
  xAxis: {
    type: 'datetime',
    ordinal: false,
    gridLineColor: '#505053',
    labels: {
      style: {
        color: '#E0E0E3',
      },
    },
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
    text: 'Transaction Price Chart (Candlestick)',
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
    },
  },
};

const chartOptions = reactive(original_options);

// watch(
//   history,
//   (newHistory) => {
//     if (newHistory && newHistory.length) {
//       chartOptions.series[0].data = newHistory.map((item) => ({
//         x: new Date(item.timestamp).getTime(),
//         y: item.price,
//       }));
//     }
//   },
//   { deep: true }
// );

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