<template>

  <v-card height="100%" elevation="3">
    <v-card-title class="cardtitle">Decision block</v-card-title>
    <v-card-subtitle> Click on red buttons to sell or buy immediately</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <h3>Buy Orders</h3>
            <div v-for="(price, index) in buyPrices" :key="'buy-' + index" class="my-1">
              <v-btn :disabled="isBuyButtonDisabled" @click="sendOrder(1, price)" outlined
                :color="getButtonColor(price, 'buy')" width="150">Buy at {{ price.toFixed(2) }}</v-btn>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <h3>Sell Orders</h3>
            <div v-for="(price, index) in sellPrices" :key="'sell-' + index" class="my-1">
              <v-btn :disabled="isSellButtonDisabled" @click="sendOrder(-1, price)" outlined
                :color="getButtonColor(price, 'sell')" width="150">Sell for {{ price.toFixed(2) }}</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>

</template>

<script setup>
import { computed } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
const tradingStore = useTraderStore();
const { sendMessage } = tradingStore;
const { gameParams, bidData, askData } = storeToRefs(tradingStore);

const step = computed(() => gameParams.value.step)

// Compute the availability of ask and bid data
const hasAskData = computed(() => askData.value.length > 0);
const hasBidData = computed(() => bidData.value.length > 0);

// Best bid and best ask calculations
const bestBid = computed(() => hasBidData.value ? Math.max(...bidData.value.map(bid => bid.x)) : null);
const bestAsk = computed(() => hasAskData.value ? Math.min(...askData.value.map(ask => ask.x)) : null);

// Generating price levels for buy and sell buttons
const buyPrices = computed(() => bestAsk.value !== null ? Array.from({ length: 5 }, (_, i) => bestAsk.value - step.value * i) : []);
const sellPrices = computed(() => bestBid.value !== null ? Array.from({ length: 5 }, (_, i) => bestBid.value + step.value * i) : []);

// Specific conditions for disabling buy and sell buttons
const isBuyButtonDisabled = computed(() => !hasAskData.value);
const isSellButtonDisabled = computed(() => !hasBidData.value);

function sendOrder(type, price) {
  sendMessage("add_order", { type, price, amount: 1 });
}
function getButtonColor(price, orderType) {
  if (orderType === "buy") {
    return price === bestAsk.value ? "red" : "grey";
  } else if (orderType === "sell") {
    return price === bestBid.value ? "red" : "grey";
  }
}
</script>

<style scoped>
.cardtitle {
  font-size: 20px;
  font-weight: bold;
  background: lightcoral;
  color: white;
}
</style>