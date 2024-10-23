<template>
  <v-card class="mx-auto"  height="100%" elevation="3" width="100%">
    <v-card-title class="text-h6">Trading Dashboard</v-card-title>

    <v-card-subtitle>Market Summary</v-card-subtitle>
    <v-card-text>
      <v-row class="mb-2">
        <v-col>
          <strong>Midpoint Price:</strong>
        </v-col>
        <v-col>{{ midpointPrice.toFixed(2) }} USD</v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col>
          <strong>Best Bid:</strong>
        </v-col>
        <v-col>{{ bestBid.toFixed(2) }} USD</v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col>
          <strong>Best Ask:</strong>
        </v-col>
        <v-col>{{ bestAsk.toFixed(2) }} USD</v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col>
          <strong>Spread:</strong>
        </v-col>
        <v-col>{{ spread.toFixed(2) }} USD</v-col>
      </v-row>
    </v-card-text>

    <v-card-subtitle>Account Summary</v-card-subtitle>
    <v-card-text>
      <v-row class="mb-2">
        <v-col>
          <strong>Shares Owned:</strong>
        </v-col>
        <v-col>{{ sharesOwned }}</v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col>
          <strong>Profit (Today):</strong>
        </v-col>
        <v-col :class="profit > 0 ? 'text--success' : 'text--error'">
          {{ profit.toFixed(2) }} USD
        </v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col>
          <strong>Current Cash:</strong>
        </v-col>
        <v-col>{{ currentCash.toFixed(2) }} USD</v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" @click="executeTrade">Execute Trade</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';

// Simulating some trading data (you would probably get this from an API)
const midpointPrice = ref(105.25);
const bestBid = ref(104.90);
const bestAsk = ref(105.60);
const sharesOwned = ref(100);
const startingPrice = ref(100); // Starting price of the stock at the beginning of the day
const currentCash = ref(15000);

// Calculated fields
const spread = computed(() => bestAsk.value - bestBid.value);
const profit = computed(() => (midpointPrice.value - startingPrice.value) * sharesOwned.value);

// Method to execute a trade (this is a placeholder)
const executeTrade = () => {
  console.log("Executing a trade...");
  // Trade logic here...
};
</script>

<style scoped>
.v-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
.text--success {
  color: green;
}
.text--error {
  color: red;
}
</style>