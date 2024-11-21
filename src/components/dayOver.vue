<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Day Overview</v-card-title>
              <v-card-text>
                <v-list>
                  <!-- Initial Cash -->
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Initial cash</v-list-item-title>
                      <div>{{ initialCash }}</div>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Final Cash -->
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Final cash</v-list-item-title>
                      <div>{{ cash }}</div>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Change in Cash -->
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Change in cash:</v-list-item-title>
                      <div>{{ cash - initial_cash }}</div>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Initial Shares -->
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Initial shares</v-list-item-title>
                      <div>{{ initial_shares }}</div>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Final Shares -->
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        >Final amount of shares</v-list-item-title
                      >
                      <div>{{ shares }}</div>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useTraderStore } from "@/store/app";

// Access the trader store and destructure necessary values
const tradingStore = useTraderStore();
const { initial_cash, cash, initial_shares, shares } = storeToRefs(tradingStore);
</script>
