<template>
  <v-app>
    <v-app-bar app fixed class="timerbar" :density="smAndDown ? compact : comfortable">
      <CountdownCard title="Till the end of the day" :total-time="dayRemainingTime / 1000" :overall-time="day_duration"
        progress-bar-color="primary" progress-type="linear" @time-updated="handleTimeUpdated"
        @timer-restarted="finalizingDay" />
      <QuizDialog ref="quizDialog" @dialog-closed="handleDialogClosed" />
    </v-app-bar>

    <v-app-bar app fixed class="" :density="smAndDown ? compact : comfortable" :style="topStyle">

      <v-toolbar v-if="true">
        <CountdownCard title="Till next decision" :total-time="tick_frequency" progress-bar-color="red" :interval="100"
          @timer-restarted="handleTimerRestarted"> </CountdownCard>


        <v-spacer></v-spacer>


        <v-card class="mx-2" outlined>
          <v-card-text class="font-weight-bold">
            Insiders:

            <span>50%</span>

          </v-card-text>
        </v-card>


        <!-- Shares -->
        <v-card class="mx-2" outlined>
          <v-card-text class="font-weight-bold">
            Shares:

            <span>
              <span>{{ shares }}</span>
              <Transition enter-active-class="fade-in-highlight" :key="shares">

              </Transition>
            </span>

          </v-card-text>
        </v-card>

        <!-- Cash -->
        <v-card class="mx-2" outlined>
          <v-card-text class="font-weight-bold">
            Cash:
            <Transition enter-active-class="fade-in-highlight">
              <span :key="cash">{{ cash }}</span>
            </Transition>
          </v-card-text>
        </v-card>

        <!-- Include other market fundamentals and inventory status here -->
      </v-toolbar>

    </v-app-bar>

    <v-main class="main-container">
      <v-container fluid class="pa-0" style="height: calc(100vh - 50px);">
        <!-- First Row: History Chart -->
        <v-row class="pa-3" style="height: calc(50vh - 50px);">
          <v-col :style="{ height: '100%' }">
            <div class="mb-1" style="margin-top: 50px;" :style="{ height: '100%' }">
              <HistoryChart />
            </div>
          </v-col>
        </v-row>

        <!-- Second Row: BidAskTable and SellingBlock -->
        <v-row class="pa-3"  style="height: calc(50vh - 50px);">
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


    <v-footer app  >
       
    </v-footer>
  </v-app>
</template>

<script setup>
const props = defineProps({
  traderUuid: String,
});


// import BidAskChart from "@/components/BidAskChart.vue";
import { useDisplay } from "vuetify";
const { smAndDown, name } = useDisplay();
const height = computed(() => {
  // name is reactive and
  // must use .value
  switch (name.value) {
    case 'xs': return 220
    case 'sm': return 400
    case 'md': return 500
    case 'lg': return 600
    case 'xl': return 800
    case 'xxl': return 1200
  }

  return undefined
})
const topStyle = computed(() => {
  switch (name.value) {
    case "xs":
      return { top: "30px" }; // Apply top: 30px for "sm"
    case "sm":
      return { top: "45px" }; // Apply top: 30px for "sm"  
    case "md":
      return { top: "55px" }; // Apply top: 30px for "sm"
    case "xl":
      return { top: "55px" }; // Apply top: 50px for "xl"
    default:
      return {}; // Default empty style
  }
});
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import QuizDialog from "./QuizDialog.vue";

const quizDialog = ref(null);
import HistoryChart from "@/components/HistoryChart.vue";
import BidAskTable from "./BidAskTable.vue";
import sellingBlock from "./sellingBlock.vue";
import CountdownCard from "./CountdownCard.vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";
import { watch, ref, onMounted, computed } from "vue";
const store = useTraderStore();
const { gameParams, shares, cash, initial_shares, dayOver, isTimerPaused, dayRemainingTime, day_duration,
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
  position: static; /* Default behavior */
}

@media (max-width: 600px) {
  .selling-block-col {

    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10; /* Ensure it appears above other elements */
    
    padding: 16px; /* Add padding for better spacing */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* Optional: add shadow for better visibility */
  }
}
</style>
