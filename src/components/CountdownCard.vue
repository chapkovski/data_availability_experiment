<template>
  <v-card class="mx-2 p-1">
    <v-card-text class="timertext">
      <v-progress-circular :model-value="progressValue" :color="progressBarColor"></v-progress-circular>
      <!-- Updated remainingTime to remainingTime.value -->
      <vue-countdown @progress="updTime" @end="restartTimer" :time="totTimeInMilliseconds"
      :key="resetKey"  
        v-slot="{ days, hours, minutes, seconds }">
      

        <div>{{ title }}: {{ Math.floor(remainingTime / 1000) }} seconds</div>
      </vue-countdown>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
const props=defineProps(['title', 'progressBarColor','totalTime'])
// Reactive state for remainingTime and progressValue

 // A dynamic key to force the vue-countdown component to re-render when the timer restarts
const resetKey = ref(0);

const totTimeInMilliseconds = computed(() => (props.totalTime) * 1000);
const remainingTime = ref(totTimeInMilliseconds.value);
const progressValue = computed(() => (remainingTime.value / totTimeInMilliseconds.value) * 100);
// Methods
const updTime = (time) => {
  remainingTime.value = time.totalMilliseconds; // Update remaining time
};

const restartTimer = () => {
  remainingTime.value = totTimeInMilliseconds.value; // Reset remaining time to total time
    // Trigger a countdown restart by incrementing the key, forcing re-render
    resetKey.value += 1;
}; 

</script>

<style scoped>
.timertext{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>