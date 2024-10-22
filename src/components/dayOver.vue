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
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Initial cash</v-list-item-title>
                      <div>{{ traderInfo?.initial_cash }}</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Final cash</v-list-item-title>
                      <div>{{ traderInfo?.cash }}</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Change in cash:</v-list-item-title>
                      <div>{{ traderInfo?.delta_cash }}</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Initial shares</v-list-item-title>
                      <div>{{ traderInfo?.initial_shares }}</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        >Final amount of shares</v-list-item-title
                      >
                      <div>{{ traderInfo?.shares }}</div>
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
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  traderUuid: String,
});

// Reactive state to store trader information
const traderInfo = ref(null);

const httpUrl = import.meta.env.VITE_HTTP_URL; // Access the environment variable

async function fetchTraderInfo() {
  try {
    const response = await axios.get(`${httpUrl}trader_info/${props.traderUuid}`);
    traderInfo.value = response.data.data; // Adjust based on your API response
  } catch (error) {
    console.error('Failed to fetch trader info:', error);
    // Handle the error appropriately
  }
}
// Fetch trader information when component mounts
onMounted(fetchTraderInfo);
</script>
