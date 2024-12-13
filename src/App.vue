<template>
  <TradingSystem :traderUUID="'12345'" />
</template>

<script setup>
import TradingSystem from "@/components/TradingSystem.vue";

const testValue = import.meta.env.VITE_TEST;
</script>