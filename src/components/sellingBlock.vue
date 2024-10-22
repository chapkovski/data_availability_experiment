<template>
  <v-card height="100%" elevation="3">
    <v-card-title class="cardtitle">Decision Block</v-card-title>
    <v-card-subtitle>Click on buttons to buy or sell immediately</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row>
          <!-- Buy Button -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <v-btn
              large
              color="green"
              :disabled="isBuyButtonDisabled"
              @click="sendOrder(1, bestAsk)"
              width="100%"
            >
              Buy @ BEST BID
            </v-btn>
          </v-col>

          <!-- Sell Button -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <v-btn
              large
              color="red"
              :disabled="isSellButtonDisabled"
              @click="sendOrder(-1, bestBid)"
              width="100%"
            >
              Sell @ BEST ASK
            </v-btn>
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
const { bidData, askData } = storeToRefs(tradingStore);

// Compute the availability of ask and bid data
// const hasAskData = computed(() => askData.value.length > 0);
// const hasBidData = computed(() => bidData.value.length > 0);

// Best bid and best ask calculations
// const bestBid = computed(() => hasBidData.value ? Math.max(...bidData.value.map(bid => bid.x)) : null);
// const bestAsk = computed(() => hasAskData.value ? Math.min(...askData.value.map(ask => ask.x)) : null);

// Specific conditions for disabling buy and sell buttons
// const isBuyButtonDisabled = computed(() => !hasAskData.value || bestAsk.value === null);
// const isSellButtonDisabled = computed(() => !hasBidData.value || bestBid.value === null);

// Sending order with type (1 for buy, -1 for sell) and the best available price
function sendOrder(type, price) {
  if (price !== null) {
    sendMessage("add_order", { type, price, amount: 1 });
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