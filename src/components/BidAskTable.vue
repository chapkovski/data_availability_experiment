<template>
  <v-card class="mx-auto" :class="framing === 'Premium' ? `premium-card` : ``">
    <v-card-title v-if="true">Time & Sales <v-chip v-if="framing === 'Premium'">{{ premium }}</v-chip></v-card-title>
    <v-card-text class="pt-0 mt-0" :class="{ 'full-height-center': market_signal_strength === 'Low' }">
      <!-- Conditional rendering based on market_signal_strength -->
      <div v-if="market_signal_strength === 'Low'" class="no-access">

        <v-overlay v-model="no_data_available" contained persistent style="align-items: center;"
          class="text-center align-content-center justify-center justify-content-center d-flex flex-row align-items-center">
          <v-card class="bg-red text-white">
            <v-card-text color="red"> {{ no_data_message }}</v-card-text>
          </v-card>
        </v-overlay>



      </div>

      <v-table v-else class="scrollable-table order-table" fixed-header style='width:100%' density="compact">
        <thead>
          <tr>
            <th class="text-left pa-0">Time</th>
            <th class="text-left pa-0">Price (USD)</th>
            <th class="text-left pa-0">Size</th>
            <th class="text-left pa-0">Condition</th>
          </tr>
        </thead>




        <!-- Display rows if orders has data -->
        <transition-group name="" tag="tbody">
          <tr v-if="!orders.length">
            <td colspan="4" class="no-data-message">No data yet</td>
          </tr>

          <tr class="custom-row" v-for="item in orders" :key="item.random_id" :class="{
            'at-ask': item.condition === 'at ask',
            'at-bid': item.condition === 'at bid'
          }">
            <td>{{ formatTime(new Date(item.timestamp)) }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.condition }}</td>
          </tr>
        </transition-group>

      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

import { useDisplay } from "vuetify";
const { smAndDown, height, width } = useDisplay();

const showTableTitle = computed(() => {
  return !smAndDown.value;
});
import { useTraderStore } from '@/store/app';
import { storeToRefs } from 'pinia';
const store = useTraderStore();
const { market_signal_strength, orders, no_data_message, framing } = storeToRefs(useTraderStore());
const premium = computed(() => {
  return framing.value === 'Premium' ? 'Premium ' : ''
});
const no_data_available = computed(() => {
  return market_signal_strength.value === 'Low';
});
const formatTime = (timestamp) => {
  // Format the time in 24-hour format
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
  }).format(new Date(timestamp));
}

</script>

<style scoped>
.custom-row {
  height: 3px !important;
  /* Ensures explicit height for rows */
}

.custom-row td {
  padding: 0 !important;
  /* Removes padding to minimize height */
  line-height: 1 !important;
  /* Controls text spacing to reduce height */
}

.scrollable-table {
  max-height: 300px;
  /* Set a fixed height */
  overflow-y: auto;
  /* Enable vertical scrolling */
}

/* Only applies when market_signal_strength is Low */
.full-height-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  /* Full height to center content */
}

.no-access {
  font-weight: bold;
  color: gray;
  text-align: center;
}

.order-table div.v-table__wrapper {
  padding: 5px;
  border-radius: 25px;
}

/* Conditional row styling */
.at-ask {
  color: green;
}

.at-bid {
  color: red;
}

/* Transition styles for new items */
.highlight-enter-active {
  animation: fadeInHighlight 1s ease-out;
  /* Fade-in animation for new rows */
}

@keyframes fadeInHighlight {
  from {
    background-color: yellow;
  }

  to {
    background-color: transparent;
  }
}

.no-data-message {
  text-align: center;
  font-weight: bold;
  color: gray;
}

/* Default font size for table headers */
thead>tr>th {
  font-size: 16px;
  /* Default size */
}

/* Decrease font size for headers on smaller screens */
@media (max-width: 900px) {
  thead>tr>th {
    font-size: 12px !important;
    /* Smaller font size for mobile devices */
  }
}
</style>

<style scoped>
.premium-card {
  background: radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);
  background-size: cover;
}
</style>

<style scoped>
.v-card-title,
.v-card-text {
  background: transparent;
}

.v-table {
  background: rgba(255, 255, 255, 0.5);
  /* Semi-transparent white */
  border-radius: 8px;
  /* Optional, for better aesthetics */
}

thead tr th {
  background: rgba(255, 255, 255, 0.5) !important;
  /* Semi-transparent white */

}

.custom-row {
  background: rgba(255, 255, 255, 0.5);
  /* Rows with transparency */
}

.no-access {
  background: rgba(255, 255, 255, 0.8);
  /* Slightly opaque for readability */
  color: #5d4a1f;
  /* Match the golden theme for text color */
}

.no-data-message {
  background: rgba(255, 255, 255, 0.7);
  color: #5d4a1f;
  text-align: center;
}
</style>

<style scoped>
.v-card {
  padding: 5px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
<style>
.order-table div.v-table__wrapper {
  padding: 5px;
  border-radius: 25px;
}
</style>