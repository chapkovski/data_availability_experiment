<template>
  <v-card :class="`d-flex align-center justify-center  ma-1 pa-0 ${cardColor}`" outlined
    :height="smallerScreen ? 40 : 50" rounded="lg">
    <v-card-text class="d-flex flex-column align-center justify-center"
      :style="{ padding: smallerScreen ? '2px' : '8px' }">
      <div :class="{ 'small-title': smallerScreen }" class="">
        {{ smallerScreen ? mobileTitle : title }}
      </div>
      <Transition :enter-active-class="enterClass" :leave-active-class="leaveClass">
        <span :key="displayValue" class="displayValue">{{ displayValue }} <span v-if="suffix" style="font-size:8px;font-weight: normal;">{{suffix}}</span></span>  
        
      </Transition>
      
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps({
  suffix: {
    type: String,
    default: null, // Optional suffix
  },
  title: {
    type: String,
    required: true,
  },
  smallTitle: {
    type: String,
    default: null, // Optional: Use `null` as default
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
// State
const previousValue = ref(props.value);
const direction = ref('UP'); // 'UP' or 'DOWN'

watch(
  () => props.value,
  (newValue, oldValue) => {
    direction.value = newValue > oldValue ? 'UP' : 'DOWN';
    previousValue.value = newValue;
  },
);

const mobileTitle = computed(() => {
  return props.smallTitle || props.title; // Use `smallTitle` if provided, otherwise fallback to `title`
});

// Dynamic classes for animations
const enterClass = computed(() => {
  return direction.value === 'UP'
    ? 'animate__animated animate__backInUp'
    : 'animate__animated animate__backInDown';
});

const leaveClass = computed(() => {
  return direction.value === 'UP'
    ? 'animate__animated animate__backOutUp'
    : 'animate__animated animate__backOutDown';
});
// Compute display value
const displayValue = computed(() => {
  if (props.value !== null) {
    const decimalPlaces = smallerScreen.value?0:props.decimalPlaces;
    return props.value.toFixed(decimalPlaces);
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
  font-size: 0.60rem;
  /* Smaller font for mobile screens */
}

/* Default title styling for larger screens */
.font-weight-bold {
  font-size: 16px;
  /* Default size for larger screens */
}

/* Optional: Customize card appearance */
.v-card {
  border-radius: 12px;
  /* Rounded corners */
}

.displayValue {
  font-weight: bolder;
  font-size: 1.2rem;
}

@media (max-width: 900px) {
  .displayValue {
    font-weight: bolder;
    font-size: 0.7rem;
  }
}
</style>