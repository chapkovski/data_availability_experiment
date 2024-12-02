<template>
    <v-card
      :class="`ma-1 pa-0 ${cardColor}`"
      outlined
      :height="smallerScreen ? 40 : 50"
      rounded="lg"
    >
      <v-card-text
        class=""
        :style="{ padding: smallerScreen ? '2px' : '8px' }"
      >
        <div :class="{ 'small-title': smallerScreen }" class="">
          {{ title }}
        </div>
        <Transition enter-active-class="fade-in-highlight">
          <span :key="value" class="displayValue">{{ displayValue }}</span>
        </Transition>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useDisplay } from 'vuetify';
  
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: null, // Default to null if not provided
    },
    stringValue: {
      type: String,
      default: null, // Optional string value
    },
    color: {
      type: String,
      default: 'primary', // Default card color
    },
    decimalPlaces: {
      type: Number,
      default: 2, // Number of decimal places to display
    },
  });
  
  // Vuetify display composable for screen size detection
  const { smAndDown, height, width } = useDisplay();
  
  // Determine if the screen is small (height < 600 or width < 400)
  const smallerScreen = computed(() => smAndDown.value || height.value < 600 || width.value < 400);
  
  // Compute display value
  const displayValue = computed(() => {
    if (props.value !== null) {
      return props.value.toFixed(props.decimalPlaces);
    }
    return props.stringValue || 'N/A'; // Default to 'N/A' if neither value nor stringValue is set
  });
  
  // Dynamic card color
  const cardColor = computed(() => `bg-${props.color}`);
  </script>
  
  <style>
  .v-card .v-card-text {
    line-height: 1.2;
}
  /* Small title styling for small screens */
  .small-title {
    font-size: 0.75rem; /* Smaller font for mobile screens */
  }
  
  /* Default title styling for larger screens */
  .font-weight-bold {
    font-size: 16px; /* Default size for larger screens */
  }
  
  /* Optional: Customize card appearance */
  .v-card {
    border-radius: 12px; /* Rounded corners */
  }
  .displayValue{
    font-weight: bolder;
    font-size:16px
  }
  </style>