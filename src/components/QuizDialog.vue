<script setup>
import { ref, computed, defineEmits, defineExpose } from "vue";

const dialogVisible = ref(false); // State for dialog visibility
const stockProbability = ref(null); // Default to 50% likelihood
const confidenceRating = ref(null); // Default to midpoint of the Likert scale
const emit = defineEmits(["dialog-closed"]); // Emit an event to notify parent
// Computed property to check if the form is valid
const isFormValid = computed(() => stockProbability.value !== null && confidenceRating.value !== null);
const confidenceOptions = [
  { value: 1, label: "Absolutely Not Sure" },
  { value: 2, label: "Somewhat Not Sure" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Somewhat Sure" },
  { value: 5, label: "Absolutely Sure" },
];
// Method to open the dialog
const openDialog = () => {
  dialogVisible.value = true;
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
};

// Expose methods to the parent
defineExpose({ openDialog, closeDialog });
</script>

<template>
  <v-dialog v-model="dialogVisible" persistent>
    <v-card>
      <v-card-title class="text-h5">Mid-day Quiz</v-card-title>
      <v-card-text>
        <div>
          <p>How likely is the stock to go up next?</p>
          <v-slider
            v-model="stockProbability"
            :max="100"
            :min="0"
            step="1"
            ticks
            tick-size="3"
            class="my-4"
            label="Likelihood (%)"
            persistent-hint
             :thumb-size="36"
        thumb-label
          ></v-slider>
          <p>How confident are you in this assessment?</p>
          <v-radio-group v-model="confidenceRating" class="my-4">
            <v-radio
              v-for="option in confidenceOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!isFormValid" color="primary" @click="closeDialog">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>