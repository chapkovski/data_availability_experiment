<template>
  <v-card class="mx-auto">
    <v-card-title>Time & Sales</v-card-title>
    <v-card-text>
      <v-table class="scrollable-table" fixed-header>
        <thead>
          <tr>
            <th class="text-left">Timestamp</th>
            <th class="text-left">Price (USD)</th>
            <th class="text-left">Size</th>
            <th class="text-left">Condition</th>
          </tr>
        </thead>
        <tbody is="transition-group" name="animate__animated animate__bounce">
          <tr
            v-for="item in actions"
            :key="item.random_id"
            class="animate__fadeIn animate__animated animate__slow"
            :class="{'at-ask': item.condition === 'At ask', 'at-bid': item.condition === 'At bid'}"
          >
            <td>{{ new Date(item.timestamp).toLocaleTimeString() }}</td>
            <td>{{ item.price.toFixed(2) }} USD</td>
            <td>{{ item.size }}</td>
            <td>{{ item.condition }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const actions = ref([]);

// Function to generate random actions with new fields: price, size, and condition
const generateRandomAction = () => {
  const randomPrice = parseFloat((Math.random() * 100 + 100).toFixed(2)); // Random price between 100 and 200
  const size = Math.floor(Math.random() * 100) + 1; // Random size between 1 and 100
  const condition = Math.random() > 0.5 ? 'At ask' : 'At bid'; // Randomly select condition

  return {
    random_id: Math.random().toString(36).substr(2, 9), // Generate a random ID
    timestamp: Date.now(),
    price: randomPrice,
    size: size,
    condition: condition,
  };
};

// Add a new action every second
setInterval(() => {
  const newAction = generateRandomAction();
  actions.value.unshift(newAction); // Add the new action to the top of the table
  if (actions.value.length > 10) {
    actions.value.pop(); // Optional: limit to 10 entries to avoid infinite growth
  }
}, 3000);

</script>

<style scoped>
tr {
  transition: transform 1s; /* Smooth movement transition */
  font-weight: bold;
}
.scrollable-table {
  max-height: 300px; /* Set a fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
}

/* Conditional row styling */
.at-ask {
  color: green;
}

.at-bid {
  color: red;
}

/* Transition styles */
.fade-move {
  transition: transform 1s; /* Smooth movement transition */
}

.fade-enter-active {
  animation: fadeInHighlight 1s ease-out; /* Entry animation for new items */
}

@keyframes fadeInHighlight {
  from {
    background-color: yellow;
  }
  to {
    background-color: transparent;
  }
}
:root {
  background-color: blue;
}
</style>