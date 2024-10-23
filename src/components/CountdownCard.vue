<template>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from 'vue';

// Define a reactive property
const message = ref('Hello, this is a basic div template!');
</script>

<style scoped>
/* Add some basic styling */
div {
  font-size: 20px;
  color: #333;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>