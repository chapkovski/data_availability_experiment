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
const serverActive = ref(true); // Assuming server is always available now
const connectionServerMessage = computed(() => {
  return serverActive.value
    ? "Launch demo session"
    : "Server is not available";
});
const formState = ref({});

// Updated form fields to include num_of_ticks_in_day instead of day_duration
const formFields = ref([
  {
    name: "tick_frequency",
    title: "Tick Frequency (seconds)",
    type: "number",
    hint: "Enter tick frequency",
    default: 5,
  },
  {
    name: "num_of_ticks_in_day",
    title: "Number of Ticks in a Day",
    type: "number",
    hint: "Enter the number of ticks in a day",
    default: 10,
  },
  {
    name: "midday_quiz_tick",
    title: "Midday Quiz Tick Number",
    type: "number",
    hint: "Enter the tick number for the quiz dialog",
    default: 5, // Default to halfway through the ticks
  },
  {
    name: "market_signal_strength",
    title: "Market Signal Strength",
    type: "select", // Changed to dropdown
    options: ["High", "Low"], // Options for the dropdown
    default: "High",
  },
  
]);

// Initialize formState with default values
formFields.value.forEach((field) => {
  formState.value[field.name] = field.default;
});



const initializeTrader = async () => {
  // Add the random UUIDs to the formState
  formState.value.tradingSessionUUID = crypto.randomUUID();
  formState.value.traderUUID = crypto.randomUUID();

  // Calculate day_duration dynamically before passing to the store
  formState.value.day_duration =
    formState.value.tick_frequency * formState.value.num_of_ticks_in_day;

  await traderStore.initializeTradingSystem(formState.value);

  // Redirect to the trading system page with the generated UUID
  router.push({
    name: "TradingSystem",
    params: {
      tradingSessionUUID: formState.value.tradingSessionUUID,
      traderUUID: formState.value.traderUUID,
    },
  });
};

onMounted(() => {
  serverActive.value = true;
  console.debug(traderStore.initializeTradingSystem);
  traderStore.generateHistory();
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>