<template>
  <v-app>

    <v-app-bar app fixed class="timerbar  d-flex flex-column " :density="smAndDown ? compact : comfortable"
      height="smAndDown ? 30 : 64">
      <CountdownCard title="Time to end of round" :total-time="dayRemainingTime / 1000" :overall-time="day_duration"
        progress-bar-color="primary" progress-type="linear" @time-updated="handleTimeUpdated"
        @timer-restarted="finalizingDay" />


      <v-toolbar class="d-flex flex-row mt-1" style="flex-direction:'row!important'" :height="smAndDown ? 49 : 64">
        <div class="d-flex flex-row" style="width:100%">
          <CountdownCard title="Time to next tick" :total-time="tick_frequency" progress-bar-color="red" :interval="100"
            @timer-restarted="handleTimerRestarted"> </CountdownCard>
          <status-card title="Round:" :stringValue="1" color="orange" />

          <v-spacer></v-spacer>
          <div class="d-flex flex-row " v-if="smAndDown">
            <status-card title="Insiders:" :stringValue="`50%`" color="red" />

            <status-card title="Total Wealth:" :value="totalWealth" color="green" />
            <div class="mr-3">
              <status-card title="Current Price" :value="currentPrice" color="blue" />
            </div>
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


    <v-footer app>
      <v-system-bar v-if="false" elevation="3" color="orange"
        class="d-flex justify-center align-center  border border-thin">
        <div class="">JOPA</div>
      </v-system-bar>
    </v-footer>
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

const quizDialog = ref(null);
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
const { gameParams, totalWealth, currentPrice, dayOver, isTimerPaused, dayRemainingTime, day_duration,
  midday_quiz_tick, timerCounter, tick_frequency } = storeToRefs(useTraderStore());


onMounted(() => {
  console.log("Trading system mounted");
  store.makeTick();
  store.processOrdersForCurrentTick()
});


const localRemainingTime = ref(dayRemainingTime.value);
const handleDialogClosed = (response) => {
  console.debug("Quiz responses received:", response);

  // Reset dialog state
  isTimerPaused.value = false; // Resume the timer
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
    isTimerPaused.value = true; // Pause the timer
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
  router.push({ name: "DayOver", params: { traderUUID: props.traderUUID } });
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
