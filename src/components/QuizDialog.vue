<script setup>
import { ref, computed, defineEmits, defineExpose } from "vue";
import Likert from "./Likert.vue"; // Import the Likert component

const dialogVisible = ref(false); // State for dialog visibility
const stockProbability = ref(null); // Stock probability mapped to Likert scale
const confidenceRating = ref(null); // Confidence rating mapped to Likert scale
const step = ref(1); // Tracks the current step (1 or 2)
const emit = defineEmits(["dialog-closed"]); // Emit an event to notify parent

// Computed properties to check validity of each step
const isStep1Valid = computed(() => stockProbability.value !== null);
const isStep2Valid = computed(() => confidenceRating.value !== null);

// Labels for Likert scales
const probabilityLabels = [
  "Not Likely at All",
  "Unlikely",
  "Neutral",
  "Likely",
  "Very Likely",
];
const confidenceLabels = [
  "Absolutely Not Sure",
  "Somewhat Not Sure",
  "Neutral",
  "Somewhat Sure",
  "Absolutely Sure",
];

// Method to open the dialog
const openDialog = () => {
  dialogVisible.value = true;
};

// Method to handle "Next" button
const nextStep = () => {
  if (step.value === 1 && isStep1Valid.value) {
    step.value = 2;
  }
};

// Method to close the dialog and notify parent
const closeDialog = () => {
  // Prepare the response to emit
  const response = {
    stockProbability: stockProbability.value,
    confidenceRating: confidenceRating.value,
  };

  console.debug("User response:", response);

  // Emit the dialog closed event with user responses
  emit("dialog-closed", response);

  // Close the dialog
  dialogVisible.value = false;

  // Reset values for next use
  stockProbability.value = null;
  confidenceRating.value = null;
  step.value = 1; // Reset to the first step
};

// Expose methods to the parent
defineExpose({ openDialog, closeDialog });
</script>

<template>
  <v-dialog v-model="dialogVisible" persistent max-width="850px">
    <v-card>
      <v-card-title class="text-h5">Mid-day Quiz</v-card-title>
      <v-card-text>
        <div v-if="step === 1">
          <!-- Stock Probability Likert Scale -->
          <p>How likely is the stock to go up next?</p>
          <likert
            :labels="probabilityLabels"
            v-model="stockProbability"
          ></likert>
        </div>
        <div v-else-if="step === 2">
          <!-- Confidence Rating Likert Scale -->
          <p>How confident are you in this assessment?</p>
          <likert
            :labels="confidenceLabels"
            v-model="confidenceRating"
          ></likert>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="step === 1"
          size="x-large"
          :disabled="!isStep1Valid"
          variant="outlined"
          color="primary"
          @click="nextStep"
        >
          Next
        </v-btn>
        <v-btn
          v-if="step === 2"
          size="x-large"
          :disabled="!isStep2Valid"
          variant="outlined"
          color="primary"
          @click="closeDialog"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
@media (max-width: 900px) {
  .v-slider-track__tick-label {
    white-space: normal; /* Allow text to wrap */
    text-align: center; /* Optional: center-align wrapped text */
    word-wrap: break-word; /* Ensure long words break nicely */
  }
}</style>