<template>
  <v-app app>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="6">
          <v-form class="my-3">
            <v-row>
              <v-col cols="12" sm="6" v-for="field in formFields" :key="field.name">
                <!-- Checkbox for Treatment -->
                <v-checkbox v-if="field.type === 'checkbox'" :label="field.title"
                  v-model="formState[field.name]"></v-checkbox>

                <!-- Dropdown (v-select) for Market Signal Strength -->
                <v-select v-if="field.type === 'select'" :label="field.title" v-model="formState[field.name]"
                  :items="field.options"></v-select>

                <!-- Text fields for other inputs -->
                <v-text-field v-else :label="field.title" v-model="formState[field.name]"
                  :type="field.type === 'number' ? 'number' : 'text'" :hint="field.hint" variant="solo"
                  persistent-hint></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-btn color="primary" large @click="initializeTrader" :disabled="!serverActive">{{ connectionServerMessage
            }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const traderStore = useTraderStore();
const router = useRouter();
const serverActive = ref(true);  // Assuming server is always available now
const connectionServerMessage = computed(() => {
  return serverActive.value
    ? "Launch demo session"
    : "Server is not available";
});
const formState = ref({});

// Hardcoded form fields
const formFields = ref([
  {
    name: "tick_frequency",
    title: "Tick Frequency Update",
    type: "number",
    hint: "Enter tick frequency",
    default: 5,
  },
  {
    name: "day_duration",
    title: "Overall Day Duration (minutes)",
    type: "number",
    hint: "Enter duration in minutes",
    default: 3,
  },
  {
    name: "market_signal_strength",
    title: "Market Signal Strength",
    type: "select",  // Changed to dropdown
    options: ["High", "Low"],  // Options for the dropdown
    default: "High",
  },
  {
    name: "data_latency",
    title: "Data Latency (seconds)",
    type: "number",
    hint: "Enter data latency in seconds",
    default: 3,
  },
]);
// Initialize formState with default values
formFields.value.forEach((field) => {
  formState.value[field.name] = field.default;
});

const { tradingSessionData } = storeToRefs(useTraderStore());

const initializeTrader = async () => {
  // Add the random UUID to the formState
  formState.value.tradingSessionUUID = crypto.randomUUID();
  formState.value.traderUUID = crypto.randomUUID();

  await traderStore.initializeTradingSystem(formState.value);

  // redirect to the trading system page with the generated UUID
  router.push({
    name: "TradingSystem",
    params: {
      tradingSessionUUID: formState.value.tradingSessionUUID,
      traderUUID: formState.value.traderUUID
    }

  });
};

onMounted(() => {
  serverActive.value = true;
  console.debug(traderStore.initializeTradingSystem)
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>