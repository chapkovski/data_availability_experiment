<template>
  <v-card :style="cardStyle">
    <v-card-text class="ma-1 pa-1 d-flex flex-column justify-center align-center">
      <!-- Progress Bars -->
      <v-progress-circular
        v-if="progressType === 'circular'"
        :model-value="progressValue"
        :color="progressBarColor"
        v-bind="props"
      ></v-progress-circular>

      <v-progress-linear
        v-else
        :model-value="progressValue"
        :value="progressValue"
        :color="progressBarColor"
        :height="!smAndDown ? 10 : 5"
        rounded
        striped
        v-bind="props"
      ></v-progress-linear>

      <!-- Countdown -->
      <div class="text-center" v-if="!smAndDown">
        {{ title }}: <b>{{ Math.round(remainingTime / 1000) }} seconds</b>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
const props = defineProps({
  title: String,
  progressBarColor: String,
  totalTime: Number,
  overallTime: Number,
  progressType: {
    type: String,
    default: "circular",
  },
  interval: {
    type: Number,
    default: 1000, // Default to 1 second
  },
});

import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
const store = useTraderStore();
const { isTimerPaused } = storeToRefs(store);

import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();

const emit = defineEmits(["timer-restarted", "time-updated"]);

const totTimeInMilliseconds = computed(() => props.totalTime * 1000);
const baseTimeInMilliseconds = computed(() =>
  props.overallTime ? props.overallTime * 1000 : totTimeInMilliseconds.value
);

const remainingTime = ref(totTimeInMilliseconds.value);
const progressValue = computed(() => (remainingTime.value / baseTimeInMilliseconds.value) * 100);

let timer = null;
let lastTimestamp = null;

const startTimer = () => {
  lastTimestamp = Date.now();
  timer = setInterval(() => {
    if (!isTimerPaused.value) {
      const now = Date.now();
      const elapsed = now - lastTimestamp;
      remainingTime.value = Math.max(0, remainingTime.value - elapsed);
      lastTimestamp = now;

      emit("time-updated", remainingTime.value);

      if (remainingTime.value <= 0) {
        clearInterval(timer);
        restartTimer(); // Restart the timer when it finishes
      }
    }
  }, props.interval);
};

const pauseTimer = () => {
  clearInterval(timer);
  timer = null;
};

watch(isTimerPaused, (paused) => {
  if (paused) {
    pauseTimer();
  } else {
    startTimer();
  }
});

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  pauseTimer();
});

const restartTimer = () => {
  pauseTimer();
  remainingTime.value = totTimeInMilliseconds.value;
  startTimer();
  emit("timer-restarted");
};

const cardStyle = computed(() => (props.progressType === "linear" ? { width: "100%" } : {}));
</script>
<style scoped>
.timertext {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
@media (max-width: 600px) {
  .timertext {
    padding:0.3rem!important;
  }
}
</style>