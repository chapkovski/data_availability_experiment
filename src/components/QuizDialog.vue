<script setup>
import { ref, computed, defineEmits, defineExpose } from "vue";
import Likert from "./Likert.vue"; // Import the Likert component

const dialogVisible = ref(false); // State for dialog visibility
const stockProbability = ref(null); // Stock probability mapped to Likert scale
const confidenceRating = ref(null); // Default to midpoint of the Likert scale
const emit = defineEmits(["dialog-closed"]); // Emit an event to notify parent

// Computed property to check if the form is valid
const isFormValid = computed(() => stockProbability.value !== null && confidenceRating.value !== null);

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
          <!-- Stock Probability Likert Scale -->
          <p>How likely is the stock to go up next?</p>
          <likert
            :labels="probabilityLabels"
            v-model="stockProbability"
          ></likert>

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
          size="x-large"
          :disabled="!isFormValid"
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