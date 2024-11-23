<template>
  <v-card class="mx-auto">
    <v-card-title>Time & Sales</v-card-title>
    <v-card-text
      :class="{ 'full-height-center': market_signal_strength === 'Low'  }"
    >
      <!-- Conditional rendering based on market_signal_strength -->
      <div v-if="market_signal_strength === 'Low'" class="no-access">
        You do not have level 2 privileges for TSX
      </div>
      
      <v-table v-else class="scrollable-table" fixed-header style='width:100%'>
        <thead>
          <tr>
            <th class="text-left">Timestamp</th>
            <th class="text-left">Price (USD)</th>
            <th class="text-left">Size</th>
            <th class="text-left">Condition</th>
          </tr>
        </thead>

        
          
           
          <!-- Display rows if orders has data -->
          <transition-group   name="highlight" tag="tbody">
            <tr v-if="!orders.length" >
              <td colspan="4" class="no-data-message" >No data yet</td>
            </tr>
            
            <tr
              v-for="item in orders"
              :key="item.random_id"
              :class="{
                'at-ask': item.condition === 'at ask',
                'at-bid': item.condition === 'at bid'
              }"
            >
              <td>{{ new Date(item.timestamp).toLocaleTimeString() }}</td>
              <td>{{ item.price.toFixed(2) }} USD</td>
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


 
import { useTraderStore } from '@/store/app';
import { storeToRefs } from 'pinia';
const store = useTraderStore();
const {   market_signal_strength ,orders} = storeToRefs(useTraderStore());

 
</script>

<style scoped>
.scrollable-table {
  max-height: 300px; /* Set a fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
}

/* Only applies when market_signal_strength is Low */
.full-height-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px; /* Full height to center content */
}

.no-access {
  font-weight: bold;
  color: gray;
  text-align: center;
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
  animation: fadeInHighlight 1s ease-out; /* Fade-in animation for new rows */
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
</style>