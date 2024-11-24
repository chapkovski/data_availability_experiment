<template>
    <div v-if="!isSmallScreen" class="horizontal-scale">
        <p class="text-center mb-2">Selected Value: {{ labels[internalValue] }}</p>
        <v-slider show-ticks="always" min="0" max="4" step="1" tick-size="4" :ticks="tickLabels">
            <template #thumb-label="{ modelValue }">
        <!-- Custom thumb label rendering -->
        <div class="custom-thumb-label">
          {{ labels[modelValue] }}
        </div>
      </template>
        </v-slider>

    </div>

    <!-- Vertical Radio Buttons for smaller screens -->
    <div v-else class="vertical-scale">
        <v-radio-group v-model="internalValue" column class="pa-2">
            <v-radio v-for="(label, index) in labels" :key="index" :label="label" :value="index"></v-radio>
        </v-radio-group>
    </div>


</template>

<script setup>
// example:
// Likert Scale
//           <likert :labels="['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']"
//             v-model="formState.likertValue"></likert>
import { ref, watch, computed } from "vue";
import { useDisplay } from "vuetify";
const tickLabels = {
    0: "Strongly Disagree",
    1: "Disagree",
    2: "Neutral",
    3: "Agree",
    4: "Strongly Agree",
}
// Props
defineProps({
    labels: {
        type: Array,
        required: true,
    },
    value: {
        type: Number,
        default: null,
    },
});

// Emits
const emit = defineEmits(["update:value"]);

// Vuetify's display composable to detect screen size
const { smAndDown } = useDisplay();

// Internal value for v-model
const internalValue = ref(null);

// Update parent when the value changes
watch(internalValue, (newValue) => {
    emit("update:value", newValue);
});

// Responsive detection
const isSmallScreen = smAndDown;


</script>

<style>
.custom-thumb-label{
    background-color: blue;
}
.v-locale--is-ltr.v-slider.v-input--horizontal .v-slider-track__tick--last .v-slider-track__tick-label, .v-locale--is-ltr .v-slider.v-input--horizontal .v-slider-track__tick--last .v-slider-track__tick-label {
    transform: translateX(-50%)!important;
}
.v-locale--is-ltr.v-slider.v-input--horizontal .v-slider-track__tick--first .v-slider-track__tick-label, .v-locale--is-ltr .v-slider.v-input--horizontal .v-slider-track__tick--first .v-slider-track__tick-label {
    transform: translateX(-50%)!important;
}
.horizontal-scale {
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%; */
    margin-left: 50px;
    margin-right:50px;
  }

/* .vertical-scale {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  } */

/* .slider {
    width: 100%;
    max-width: 500px;
  } */
</style>