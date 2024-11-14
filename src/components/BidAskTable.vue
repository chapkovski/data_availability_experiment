<template>
  <v-card class="mx-auto">
    <v-card-title>Time & Sales</v-card-title>
    <v-card-text>
      <v-table class="scrollable-table"   fixed-header>
        <thead>
          <tr>
            <th class="text-left">Timestamp</th>
            <th class="text-left">Type of Action</th>
            <th class="text-left">Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in actions" :key="item.timestamp">
            <td>{{ new Date(item.timestamp).toLocaleTimeString() }}</td>
            <td>{{ item.type.toUpperCase() }}</td>
            <td>{{ item.price.toFixed(2) }} USD</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

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

<style scoped>
.scrollable-table {
  max-height: 300px; /* Set a fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
}
</style>