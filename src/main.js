/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
// Plugins
import { registerPlugins } from '@/plugins'
import 'animate.css';
// Components
import App from './App.vue'
import VueCountdown from '@chenfengyuan/vue-countdown';
// Composables
import { createApp } from 'vue'


const app = createApp(App);


app.component("Splitpanes", Splitpanes);
app.component("Pane", Pane);
app.component(VueCountdown.name, VueCountdown);
registerPlugins(app)

app.mount('#app')
