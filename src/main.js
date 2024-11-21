// Composables
import { createApp } from "vue";
import App from "./App.vue"; // Your main app component

// Highcharts and modules
import Highcharts from "highcharts";
import Stock from "highcharts/modules/stock";
import HighchartsVue from "highcharts-vue";

// Import other components
import { Splitpanes, Pane } from "splitpanes";
import VueCountdown from "@chenfengyuan/vue-countdown"; // Example for VueCountdown
import { registerPlugins } from "./plugins"; // Assuming you have a plugins file

// Initialize Highcharts modules
Stock(Highcharts);
import HighchartsNoData from 'highcharts/modules/no-data-to-display';

HighchartsNoData(Highcharts);
// Create Vue app
const app = createApp(App);

// Register HighchartsVue plugin
app.use(HighchartsVue);

// Register other components
app.component("Splitpanes", Splitpanes);
app.component("Pane", Pane);
app.component(VueCountdown.name, VueCountdown);

// Register plugins and mount app
registerPlugins(app);
app.mount("#app");