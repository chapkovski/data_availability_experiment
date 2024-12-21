<template>
  <v-card height="100%" elevation="3">
    <v-overlay v-model="tradeForbidden" contained persistent z-index="100" style="align-items: center;"
      class="text-center align-content-center justify-center justify-content-center d-flex flex-row align-items-center">
      <v-card>
        <v-card-text>Trade is not allowed at the moment</v-card-text>
      </v-card>
    </v-overlay>

    <v-card-title v-if="!smAndDown">Order Entry</v-card-title>
    <v-card-text class="pa-0 pa-xs-0 pa-sm-0 pa-md-3">
      <v-sheet border rounded elevation="3">
        <v-container>

          <v-row class="d-flex flex-row flex-nowrap" style="position: relative">

            <v-col class="d-flex flex-row flex-nowrap align-items-center">



              <!-- Buy Button -->

              <v-btn :color="isBuyPossible ? `green` : `lightgray`" :disabled="!isBuyPossible" @click="handleBuy"
                class="mx-1 flex-grow-1 flex-shrink-1">
                Buy@{{ bestSellingPrice }}
              </v-btn>


              <!-- Sell Button -->

              <v-btn large :color="isSellPossible ? `red` : `lightgray`" :disabled="!isSellPossible"
                class="mx-1 flex-grow-1 flex-shrink-1" @click="handleSell">
                Sell@{{ bestBuyingPrice }}
              </v-btn>

              <instructions-dialog v-if="smAndDown"></instructions-dialog>

            </v-col>
          </v-row>

        </v-container>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script setup>
import InstructionsDialog from "./InstructionsDialog.vue";
import { useDisplay } from "vuetify";
const { smAndDown, name, height, width } = useDisplay();
import { computed, ref } from "vue";
import { useTraderStore } from "@/store/app";
import { storeToRefs } from "pinia";
import StatusCard from './StatusCard.vue';
const tradingStore = useTraderStore();
const { sendMessage } = tradingStore;
const {
  timerCounter,
  bestBuyingPrice,
  bestSellingPrice,
  currentPrice,
  isBuyPossible,
  isSellPossible,
  shares,
  cash,
  totalWealth
} = storeToRefs(tradingStore);

const tradeForbidden = computed(() => {
  return timerCounter.value < 4;
});
// Handle Buy action
function handleBuy() {
  if (isBuyPossible.value) {
    shares.value += 1; // Increase shares
    cash.value -= bestSellingPrice.value; // Deduct current price from cash
    sendOrder('buy', bestSellingPrice.value);
  }
}

// Handle Sell action
function handleSell() {
  if (isSellPossible.value) {
    shares.value -= 1; // Decrease shares
    cash.value += bestBuyingPrice.value // Add current price to cash
    sendOrder('sell', bestBuyingPrice.value);
  }
}

function sendOrder(type, order_price) {
  sendMessage(

    {

      message: 'order_added',
      order_type: type,

      order_price: order_price,


    }
  );


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