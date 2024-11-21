<template>
  <v-app>
    <v-app-bar app fixed class="timerbar  ">
      <CountdownCard title="Till the end of the day" :total-time="dayRemainingTime / 1000"
        :overall-time="day_duration" progress-bar-color="primary" progress-type="linear"
        @time-updated="handleTimeUpdated" />
        <QuizDialog ref="quizDialog" @dialog-closed="handleDialogClosed" />
    </v-app-bar>
    
    <v-app-bar app fixed class="my-3">

      <v-toolbar v-if="true">
        <CountdownCard title="Till next decision" :total-time="tick_frequency" progress-bar-color="red"
          @timer-restarted="handleTimerRestarted"> </CountdownCard>


        <v-spacer></v-spacer>


        <v-card class="mx-2" outlined>
          <v-card-text class="font-weight-bold">
            Share of insiders

            <span>50%</span>

          </v-card-text>
        </v-card>


        <!-- Shares -->
        <v-card class="mx-2" outlined>
          <v-card-text>
            Shares:

            <span>
              <span>{{ initial_shares }}</span>
              <Transition enter-active-class="fade-in-highlight" :key="shares">

              </Transition>
            </span>

          </v-card-text>
        </v-card>

        <!-- Cash -->
        <v-card class="mx-2" outlined>
          <v-card-text>
            Cash:
            <Transition enter-active-class="fade-in-highlight">
              <span :key="cash">{{ cash }}</span>
            </Transition>
          </v-card-text>
        </v-card>

        <!-- Include other market fundamentals and inventory status here -->
      </v-toolbar>

    </v-app-bar>

    <v-main>
      <splitpanes class="default-theme" horizontal :push-other-panes="false" style="height: calc(100vh - 100px)">
        <pane class="p-3">
          <div clas="my-3" style="margin-top:50px">
            <HistoryChart></HistoryChart>
          </div>
        </pane>
        <pane>
          <splitpanes :push-other-panes="false">

            <pane style="max-height: 100%;">
              <BidAskTable></BidAskTable>
            </pane>
            <pane>
              <sellingBlock />
            </pane>
          </splitpanes>
        </pane>

      </splitpanes>
    </v-main>
    <!-- bottom fixed bar -->


    <v-footer app v-if="false">
      <v-alert v-if="goalMessage" :class="goalMessage.type" :color="goalMessage.type">
        <b>{{ goalMessage.text }}</b>
      </v-alert>
    </v-footer>
  </v-app>
</template>

<script setup>
const props = defineProps({
  traderUuid: String,
});


// import BidAskChart from "@/components/BidAskChart.vue";

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
  midday_quiz_tick, timerCounter, tick_frequency } =
  storeToRefs(useTraderStore());

const localRemainingTime = ref(dayRemainingTime.value);
const handleDialogClosed = (response) => {
  console.debug("Quiz responses received:", response);

  // Reset dialog state
  isTimerPaused.value = false; // Resume the timer
  dayRemainingTime.value = localRemainingTime.value; // Update Pinia store
};

const handleTimerRestarted = () => {
  console.debug("TIMER RESTARTED");
  timerCounter.value++;
  store.updatePriceHistory();

  // Check if the current timer count matches the quiz tick
  if (parseInt(timerCounter.value) === parseInt(midday_quiz_tick.value)) {
    console.debug("Midday quiz triggered");

    quizDialog.value.openDialog(); // Open the quiz dialog
    isTimerPaused.value = true; // Pause the timer
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
header.timerbar .v-toolbar__content {
  display: flex !important;
  flex-direction: column !important;
}

.splitpanes--horizontal>.splitpanes__splitter {
  height: 12px !important;
  ;

}

.splitpanes--horizontal>.splitpanes__splitter::after,
.splitpanes--horizontal>.splitpanes__splitter::before {
  background-color: rgb(33, 33, 33) !important;
  height: 2px !important;

}

.splitpanes--vertical>.splitpanes__splitter::after,
.splitpanes--vertical>.splitpanes__splitter::before {
  background-color: rgb(33, 33, 33) !important;
  width: 2px !important;
  border-radius: 0.5px !important;
  /* margin:0px!important; */
  padding: 0px !important;
  left: 40% !important;


}

.splitpanes__splitter::after,
.splitpanes__splitter::before {}

.splitpanes--vertical>.splitpanes__splitter {
  width: 12px !important;
  ;
}
</style>

<style scoped>
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

.splitpanes__panes {
  background: rgb(33, 33, 33) !important;
}

.splitpanes.default-theme .splitpanes__pane {
  background: rgb(33, 33, 33) !important;
}
</style>
