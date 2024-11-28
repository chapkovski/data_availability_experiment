<template>
    <div v-if="!isSmallScreen" class="horizontal-scale">
        <p class="text-center mb-2" v-if="model">You selected: {{ labels[model] }}</p>
        <p  class="text-center mb-2" v-else>Please choose the answer</p>
        <v-slider show-ticks="always" min="0" max="4" step="1" tick-size="4" :ticks="tickLabels"
        v-model="model">
        
        </v-slider>

    </div>

    <!-- Vertical Radio Buttons for smaller screens -->
    <div v-else class="vertical-scale">
        <v-radio-group v-model="model" column class="pa-2">
            <v-radio v-for="(label, index) in labels" :key="index" :label="label" :value="index"></v-radio>
        </v-radio-group>
    </div>


</template>

<script setup>
import _ from 'lodash';
// example:
// Likert Scale
//           <likert :labels="['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']"
//             v-model="formState.likertValue"></likert>
import { ref, watch, computed } from "vue";
import { useDisplay } from "vuetify";


// Props
const model = defineModel({
  prop: "value", // Syncs with the `value` prop from the parent
  event: "update:value", // Emits the `update:value` event for two-way binding
});

// Define additional props
const props = defineProps({
  labels: {
    type: Array,
    required: true, // Labels for Likert options (e.g., "Strongly Agree")
  },
});
 
const tickLabels = _.fromPairs(props.labels.map((label, index) => [index, label]));
// Vuetify's display composable to detect screen size
const { smAndDown, height, width } = useDisplay();

 

// Responsive detection
const isSmallScreen = computed(() => width.value<667);


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