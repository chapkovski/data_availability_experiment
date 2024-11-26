<template>
  <v-card height="100%" elevation="3">
  
    <v-card-text>
      <v-container>
        <v-row>
           
        </v-row>
        <v-row>
          <!-- Buy Button -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <v-btn large color="green" :disabled="!isBuyPossible" width="100%" @click="handleBuy">
              Buy @ {{ bestBuyingPrice }}
            </v-btn>
          </v-col>

          <!-- Sell Button -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <v-btn large color="red" :disabled="!isSellPossible" width="100%"
            @click="handleSell"
            >
              Sell @ {{ bestSellingPrice }}
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
const {
  currentPrice,
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
    cash.value -= bestBuyingPrice.value; // Deduct current price from cash
  }
}

// Handle Sell action
function handleSell() {
  if (isSellPossible.value) {
    shares.value -= 1; // Decrease shares
    cash.value += bestSellingPrice.value; // Add current price to cash
  }
}

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