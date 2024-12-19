<template>
  <v-card height="100%" elevation="3">
    <v-overlay v-model="tradeForbidden" contained persistent
    style="align-items: center;"
              class="text-center align-content-center justify-center justify-content-center d-flex flex-row align-items-center">
              <v-card>
                <v-card-text>Trade is not allowed at the moment</v-card-text>
              </v-card>
            </v-overlay>

    <v-card-title v-if="!smAndDown">Order Entry</v-card-title>
    <v-card-text class="pa-0 pa-xs-0 pa-sm-0 pa-md-3">
      <v-sheet border rounded elevation="3">
        <v-container>
          
          <v-row class="d-flex flex-row" style="position: relative">



            <!-- Buy Button -->
            <v-col cols="6" sm="6" class="d-flex justify-center pa-0 pa-xs-1   pa-sm-0 pa-md-3">
              <v-btn :color="isBuyPossible ? `green` : `lightgray`" :disabled="!isBuyPossible" width="100%"
                @click="handleBuy" class="mx-3">
                Buy @ {{ bestSellingPrice }}
              </v-btn>
            </v-col>

            <!-- Sell Button -->
            <v-col cols="6" sm="6" class="d-flex justify-center pa-0 pa-xs-1   pa-sm-0 pa-md-3">
              <v-btn large :color="isSellPossible ? `red` : `lightgray`" :disabled="!isSellPossible" width="100%"
                class="mx-3" @click="handleSell">
                Sell @ {{ bestBuyingPrice }}
              </v-btn>
            </v-col>
          </v-row>

        </v-container>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { smAndDown, name, height, width } = useDisplay();
import { computed ,ref} from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import StatusCard from './StatusCard.vue';
const tradingStore = useTraderStore();
const { sendMessage } = tradingStore;
const {
  timerCounter,
  bestBuyingPrice,
  bestSellingPrice,
  isBuyPossible,
  isSellPossible,
  shares,
  cash,
} = storeToRefs(tradingStore);

const tradeForbidden = computed(() => {
  return timerCounter.value <4;
});
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