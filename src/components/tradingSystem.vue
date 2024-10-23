<template>
  <v-app>
    <v-app-bar app fixed class="timerbar  "   >
      Till next info update: <v-progress-linear
        :value="progressValue"
        color="primary"
        height="10"
        rounded
        striped
         :model-value="progressValue"
      ></v-progress-linear>
      Till next transaction possible: <v-progress-linear
        :value="progressValue"
        color="warning"
        height="10"
        rounded
        striped
         :model-value="progressValue"
      ></v-progress-linear>
    </v-app-bar>
    <v-app-bar app fixed  class="my-3">
      
      <v-toolbar  v-if="true">
       <CountdownCard title="Till next decision" :total-time="25" progress-bar-color="red"> </CountdownCard>
       <CountdownCard title="Till next info update" :total-time="8" progress-bar-color="blue"> </CountdownCard>
      
        <v-spacer></v-spacer>

        <v-card class="mx-2" outlined>
          <v-card-text>
            VWAP: <span>VWAP</span>
          </v-card-text>
        </v-card>
        <v-card class="mx-2" outlined>
          <v-card-text>
            PnL: <span>PNL</span>
          </v-card-text>
        </v-card>

        <!-- Spread -->


        <!-- Shares -->
        <v-card class="mx-2" outlined>
          <v-card-text>
            Shares:

            <span>
              <span>{{ initial_shares }}</span>
              <Transition enter-active-class="fade-in-highlight" :key="shares">
                <v-badge color="error" :content="formatDelta" inline></v-badge>
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
      <v-container>
        <v-row>
          <v-col lg="6" sm="12">
            <div>
              BLANK: TBD
            </div>
          </v-col>
          <v-col lg="6" sm="12">
            <HistoryChart></HistoryChart>
          </v-col>
        </v-row>
        <v-row class="equal-height-columns">
          <v-col lg="6" sm="12" class="d-flex flex-column">
            <div>BLANK: TBD</div>
          </v-col>
          <v-col lg="6" sm="12" class="d-flex flex-column">
            <sellingBlock />
          </v-col>
        </v-row>
      </v-container>

    </v-main>
    <!-- bottom fixed bar -->

    <v-navigation-drawer app fixed location="right" permanent width="350" :border="false" :rail="false">
      <div class="flex-container mr-3">
        <messageBlock class="flex-child my-3"></messageBlock>
        <staticInfoBlock class="flex-child my-3"></staticInfoBlock>
      </div>
    </v-navigation-drawer>

    <v-footer app>
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
import commandTool from "@/components/commandToolBar.vue";

// import BidAskChart from "@/components/BidAskChart.vue";
import HistoryChart from "@/components/HistoryChart.vue";
import sellingBlock from "./sellingBlock.vue";
import messageBlock from "./messageBlock.vue";
import staticInfoBlock from "./staticInfoBlock.vue";
import CountdownCard from "./CountdownCard.vue";
import { useRouter } from "vue-router";
import { useFormatNumber } from "@/composables/utils";
const updTime = (time) => {
  remainingTime.value = time.totalMilliseconds;
};
const restartTimer = () => {
  remainingTime.value = totalTime;
  // how i can restart the timer

};
const { formatNumber } = useFormatNumber();
const router = useRouter();
const goalMessage = {
  type: "success",  // Could be 'success', 'error', 'warning', etc.
  text: "Your goal has been achieved successfully!"  // The message to be displayed
};
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";
import { watch, ref, onMounted, computed } from "vue";

const { gameParams, shares, cash, initial_shares, dayOver } =
  storeToRefs(useTraderStore());

const totalTime = 15000;  // 15 seconds in milliseconds
const remainingTime = ref(totalTime);

// Compute progress percentage for the progress bar
const progressValue = computed(() => (remainingTime.value / totalTime) * 100);
// const remainingTime = computed(() => {
//   const currentTime = new Date().getTime();
//   const endTime = new Date(gameParams.value.end_time).getTime();
//   return endTime - currentTime;
// });



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
}</style>

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
</style>
