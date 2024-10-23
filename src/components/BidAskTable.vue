<template>
  <v-card class="mx-auto" >
    <v-card-title>Live Trading Actions</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="actions"
        item-value="timestamp"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.timestamp="{ item }">
          {{ new Date(item.timestamp).toLocaleTimeString() }}
        </template>
        <template v-slot:item.type="{ item }">
          {{ item.type.toUpperCase() }}
        </template>
        <template v-slot:item.price="{ item }">
          {{ item.price.toFixed(2) }} USD
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const headers = [
  { text: 'Timestamp', value: 'timestamp' },
  { text: 'Type of Action', value: 'type' },
  { text: 'Price', value: 'price' }
];

// Store for actions (initial empty)
const actions = ref([]);

// Function to generate random actions (bid or ask)
const generateRandomAction = () => {
  const actionType = Math.random() > 0.5 ? 'bid' : 'ask';
  const randomPrice = (Math.random() * 100 + 100).toFixed(2); // Random price between 100 and 200

  return {
    timestamp: Date.now(),
    type: actionType,
    price: parseFloat(randomPrice)
  };
};

// Add a new action every second
setInterval(() => {
  const newAction = generateRandomAction();
  actions.value.unshift(newAction); // Add the new action to the top of the table
  if (actions.value.length > 10) {
    actions.value.pop(); // Optional: limit to 10 entries to avoid infinite growth
  }
}, 1000);

</script>