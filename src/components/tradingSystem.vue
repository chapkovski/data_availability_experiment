<template>
  <v-app>
    <v-system-bar v-if="training" elevation="3" color="orange"
      class="d-flex justify-center align-center  border border-thin">
      <div class="">Training round</div>
    </v-system-bar>
    <v-app-bar app fixed class="timerbar  d-flex flex-column " :density="smAndDown ? compact : comfortable"
      height="smAndDown ? 30 : 64" top="100">

      <CountdownCard title="Time to end of round" :total-time="dayRemainingTime / 1000" :overall-time="day_duration"
        progress-bar-color="primary" progress-type="linear" @time-updated="handleTimeUpdated"
        @timer-restarted="finalizingDay" />


      <v-toolbar class="d-flex flex-row mt-1" style="flex-direction:'row!important'" :height="smAndDown ? 49 : 64">
        <div class="d-flex flex-row" style="width:100%">
          <CountdownCard title="Time to next tick" :total-time="tick_frequency" progress-bar-color="red" :interval="100"
            @timer-restarted="handleTimerRestarted"> </CountdownCard>
          <status-card title="Round number:" small-title="Round:" :stringValue="strRoundNumber" color="orange" />

          <v-spacer></v-spacer>
          <div class="d-flex flex-row ">
            <status-card title="Arrival rate:" small-title="Rate:" :value="arrival_rate" color="yellow" suffix="trades/sec."/>
            <status-card title="Share of insiders:" small-title="Insiders:" :stringValue="strInsiders" color="red" />

            <status-card title="Total Wealth:" small-title="Wealth" :value="totalWealth" color="green" />
            <div class="">
              <status-card title="Current Price" small-title="Price" :value="currentPrice" color="blue" />
            </div>
            <div class="mr-3 align-self-center ma-0 pa-0 ">
              <v-btn color="green" v-if="!smAndDown"   elevation="4" rounded="lg" size="large" @click="openDialog">Instructions</v-btn>
  
            </div>
            <v-dialog v-model="dialogVisible" max-width="1200px">
              <v-card>
                <v-card-text>
                  <!-- Inject Content Dynamically with v-html -->
                  <div v-html="instructionContent"></div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue"  elevation="4" rounded="lg" @click="closeDialog">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </v-toolbar>

    </v-app-bar>

    <v-main class="main-container">
      <QuizDialog ref="quizDialog" @dialog-closed="handleDialogClosed" />
      <v-container fluid class="pa-0" style="height: calc(100vh - 50px);">
        <!-- First Row: History Chart -->
        <v-row class="pa-31" style="height: calc(50vh - 50px);">
          <v-col :style="{ height: '100%' }">
            <div class="mb-1" style="margin-top: 10px;" :style="{ height: '100%' }">
              <HistoryChart />
            </div>
          </v-col>
        </v-row>

        <!-- Second Row: BidAskTable and SellingBlock -->
        <v-row class="pa-3 pt-1" style="height: calc(50vh - 50px);">
          <v-col>
            <BidAskTable />
          </v-col>
          <v-col class="selling-block-col">
            <sellingBlock />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- bottom fixed bar -->


  </v-app>
</template>

<script setup>
const props = defineProps({
  traderUuid: String,
});


// import BidAskChart from "@/components/BidAskChart.vue";
import { useDisplay } from "vuetify";
const { smAndDown, name, height, width } = useDisplay();

const topStyle = computed(() => {
  return (height < 400 || width < 900) ? { top: '32px', height: null } : { top: '50px', height: '64px' }
});
import QuizDialog from "./QuizDialog.vue";

import StatusCard from './StatusCard.vue';
import HistoryChart from "@/components/HistoryChart.vue";
import BidAskTable from "./BidAskTable.vue";
import sellingBlock from "./sellingBlock.vue";
import CountdownCard from "./CountdownCard.vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";
import { watch, ref, onMounted, computed } from "vue";
const store = useTraderStore();
const { pauseGame, resumeGame, initializeTradingSystem } = store;
initializeTradingSystem();
const { gameParams, totalWealth, currentPrice, dayOver, isTimerPaused, dayRemainingTime, day_duration,
  midday_quiz_tick, timerCounter, tick_frequency, roundNumber, insiders, training, arrival_rate } = storeToRefs(useTraderStore());

const quizDialog = ref(null);


// Reactive state for dialog visibility
const dialogVisible = ref(false);

// Reactive state to hold the dynamic content
const instructionContent = ref("");

// Function to open the dialog and fetch the content dynamically
const openDialog = () => {
  pauseGame(); // Pause the timer
  // Fetch content from #instruction_container using jQuery
  const content = $("#instruction_container").html();
  instructionContent.value = content; // Set the fetched content
  dialogVisible.value = true; // Open the dialog
};

// Function to close the dialog
const closeDialog = () => {
  resumeGame();
  dialogVisible.value = false; // Close the dialog
};


const strRoundNumber = computed(() => {

  return (roundNumber.value)
});

const strInsiders = computed(() => {
  return (insiders.value * 100).toFixed(0) + "%";
});
onMounted(() => {
  console.log("Trading system mounted");
  store.makeTick();
  store.processOrdersForCurrentTick()
});


const localRemainingTime = ref(dayRemainingTime.value);
const handleDialogClosed = (response) => {
  console.debug("Quiz responses received:", response);

  // Reset dialog state
  resumeGame();
  store.processOrdersForCurrentTick();
  dayRemainingTime.value = localRemainingTime.value; // Update Pinia store
};

const handleTimerRestarted = () => {
  console.debug("TIMER RESTARTED");
  store.makeTick();

  // Check if the current timer count matches the quiz tick
  if (parseInt(timerCounter.value) === parseInt(midday_quiz_tick.value)) {
    console.debug("Midday quiz triggered");

    quizDialog.value.openDialog(); // Open the quiz dialog
    pauseGame(); // Pause the timer
  }
  if (!isTimerPaused.value) {
    store.processOrdersForCurrentTick()
  }
};



const handleTimeUpdated = (remainingTime) => {
  localRemainingTime.value = remainingTime; // Track locally
};

const router = useRouter();
const goalMessage = {
  type: "success",  // Could be 'success', 'error', 'warning', etc.
  text: "Your goal has been achieved successfully!"  // The message to be displayed
};







const finalizingDay = () => {
  //let's just refresh page
  // location.reload();
  $('#form').submit();

};
watch(
  gameParams,
  () => {
    if (gameParams.value.active === false) {
      finalizingDay();
    }
  },
  { immediate: true, deep: true }
);

watch(
  dayOver,
  (newValue) => {
    if (newValue) {
      finalizingDay();
    }
  },
  { immediate: true }
);
</script>

<style>
/* Narrow height for small screens */
@media (max-width: 600px) {
  .timerbar {
    height: 28px;
    /* Adjusted height for small screens */
  }
}

header.timerbar .v-toolbar__content {
  display: flex !important;
  flex-direction: column !important;
}
</style>

<style scoped>
.main-container {
  margin-top: 0px;
  padding-top: 70px;
  /* Default for desktop */
}

@media (max-width: 600px) {

  /* Adjust breakpoint as per Vuetify's default */
  .main-container {
    padding-top: 40px;
    /* For mobile */
  }
}

header.timerbar .v-toolbar__content {
  display: flex !important;
  flex-direction: column !important;
}

.equal-height-columns>.v-col {
  display: flex;
  flex: 1;
}

.flex-container {
  height: 100%;
  /* Ensure the flex container fills the entire drawer */
  display: flex;
  flex-direction: column;
  /* Stack children vertically */
}

.flex-child {
  flex: 1;
  /* Each child will take up equal space */
  overflow: auto;
  /* Add scroll if content overflows */
}

@keyframes fadeInHighlight {
  0% {
    background-color: yellow;
    opacity: 0;
  }

  50% {
    background-color: yellow;
    opacity: 0.5;
  }

  100% {
    background-color: transparent;
    opacity: 1;
  }
}

.fade-in-highlight {
  animation: fadeInHighlight 1s ease;
}


.selling-block-col {
  position: static;
  /* Default behavior */
}

@media (max-width: 600px) {
  .selling-block-col {

    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    /* Ensure it appears above other elements */

    /*padding: 16px; /* Add padding for better spacing */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    /* Optional: add shadow for better visibility */
  }
}
</style>
