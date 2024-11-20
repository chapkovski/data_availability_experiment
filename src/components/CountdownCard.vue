<template>
  <v-card class="mx-2 p-1" :style="cardStyle">
    <v-card-text class="timertext">

      <v-progress-circular v-if="progressType === 'circular'" :model-value="progressValue"
        :color="progressBarColor"></v-progress-circular>

      <v-progress-linear v-else :model-value="progressValue" :value="progressValue" :color="progressBarColor"
        height="10" rounded striped></v-progress-linear>


      <!-- Updated remainingTime to remainingTime.value -->
      <vue-countdown @progress="updTime" @end="restartTimer" :time="totTimeInMilliseconds" :key="resetKey"
        v-if="!isTimerPaused" v-slot="{ days, hours, minutes, seconds }">


        <div>{{ title }}: <b>{{ Math.round(remainingTime / 1000) }} seconds</b></div>
      </vue-countdown>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  title: String,
  progressBarColor: String,
  totalTime: Number,

  progressType: {
    type: String,
    default: 'circular', // Default to circular
  },

});
// Reactive state for remainingTime and progressValue
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
const store = useTraderStore();
const { isTimerPaused } = storeToRefs(store);

// A dynamic key to force the vue-countdown component to re-render when the timer restarts
const resetKey = ref(0);
const emit = defineEmits(['timer-restarted','time-updated']);
const totTimeInMilliseconds = computed(() => (props.totalTime) * 1000);
const remainingTime = ref(totTimeInMilliseconds.value);
const progressValue = computed(() => (remainingTime.value / totTimeInMilliseconds.value) * 100);
// Methods
const updTime = (time) => {
  remainingTime.value = time.totalMilliseconds; // Update remaining time
  emit('time-updated', remainingTime.value); // Emit updated time
};

const restartTimer = () => {
  remainingTime.value = totTimeInMilliseconds.value; // Reset remaining time to total time
  // Trigger a countdown restart by incrementing the key, forcing re-render
  resetKey.value += 1;

  emit('timer-restarted'); // Emit event when timer restarts
};
const cardStyle = computed(() => (props.progressType === 'linear' ? { width: '100%' } : {}));

</script>

<style scoped>
.timertext {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>