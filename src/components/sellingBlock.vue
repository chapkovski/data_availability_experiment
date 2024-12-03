<template>
  <v-card height="100%" elevation="3">
  
    <v-card-text class="pa-0 pa-xs-0 pa-sm-0 pa-md-3">
      <v-container>
      
        <v-row>
          <!-- Buy Button -->
          <v-col cols="6" sm="6" class="d-flex justify-center pa-0 pa-xs-0  pa-sm-0 pa-md-3">
            <v-btn :color="isBuyPossible?`green`:`lightgray`" :disabled="!isBuyPossible" width="100%" @click="handleBuy">
              Buy @ {{ bestSellingPrice }}
            </v-btn>
          </v-col>

          <!-- Sell Button -->
          <v-col cols="6" sm="6" class="d-flex justify-center pa-0 pa-xs-0 pa-sm-0 pa-md-3">
            <v-btn large :color="isSellPossible?`red`:`lightgray`" :disabled="!isSellPossible" width="100%"
            @click="handleSell"
            >
              Sell @ {{ bestBuyingPrice }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="!smAndDown">
          <v-col>
            <div class="d-flex flex-row justify-space-around">
            <status-card title="Share of insiders:" small-title="Insiders:"   :stringValue="`50%`" color="red" />

            <status-card title="Total Wealth:" :value="totalWealth" color="green" />
            <div class="mr-3">
              <status-card title="Current Price" :value="currentPrice" color="blue" />
            </div>
          </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { smAndDown, name, height, width } = useDisplay();
import { computed } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import StatusCard from './StatusCard.vue';
const tradingStore = useTraderStore();
const { sendMessage } = tradingStore;
const {
  currentPrice,
  totalWealth,
  bestBuyingPrice,
  bestSellingPrice,
  isBuyPossible,
  isSellPossible,
  shares,
  cash,
} = storeToRefs(tradingStore);

// Handle Buy action
function handleBuy() {
  if (isBuyPossible.value) {
    shares.value += 1; // Increase shares
    cash.value -= bestSellingPrice.value; // Deduct current price from cash
  }
}

// Handle Sell action
function handleSell() {
  if (isSellPossible.value) {
    shares.value -= 1; // Decrease shares
    cash.value += bestBuyingPrice.value // Add current price to cash
  }
}

function sendOrder(type, price) {
  if (price !== null) {
    sendMessage("add_order", { type, price, amount: 1 });
  }
}
</script>

<style scoped>
@media (max-width: 600px) {
  .custom-card-text {
    padding: 0 !important;
  }
}
.cardtitle {
  font-size: 20px;
  font-weight: bold;
  background: lightcoral;
  color: white;
}
</style>