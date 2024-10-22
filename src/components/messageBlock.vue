<template>
  <v-card     height="100%"
      elevation="3" >
    <v-card-title class="cardtitle">Message Board</v-card-title>
    <v-card-text style="height: 300px; overflow-y: auto" ref="messageContainer">
      <v-container>
        <div id="goto-container-example">
          <TransitionGroup name="message" tag="div" class="messages-container">
          <div 
            class="message animate__animated animate__heartBeat"
            v-for="(message, index) in messages" :key="index" :ref="setRef" :id="`message_${index}`">
            {{ message }}
          </div>
        </TransitionGroup>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
;
const tradingMessages = [
  "Your buy order for AAPL has been executed.",
  "Market alert: BTC has dropped by 5% in the last hour.",
  "Reminder: Your portfolio review is due next week.",
  "Trade successful: 100 shares of TSLA sold at $720.00.",
  "Market update: NASDAQ has risen by 0.5% today.",
  "Funds settled: $1,500.00 has been deposited into your account.",
  "Order placed: Buy order for 50 shares of AMZN at $3,100.00.",
  "Warning: Your margin balance is below 20%.",
  "Earnings report: MSFT beats Q3 expectations, shares jump.",
  "Dividend received: $250.00 from KO.",
  "New research report available: Analysis on the recent trends in the EV market.",
  "Price alert: Gold has reached a new 6-month high.",
  "Your limit order to sell 200 shares of NFLX at $550.00 has been placed.",
  "Portfolio update: Your investments have gained 2.5% in value this month.",
  "Reminder: Check out the latest investment strategies on our blog.",
  "Dividend announcement: JNJ has declared a $1.05 per share dividend.",
  "Economic update: The Federal Reserve hints at possible rate hikes next quarter.",
  "Your watchlist update: AMD stock has increased by over 10% this week.",
  "Security notice: Remember to update your password regularly to protect your account.",
  "System maintenance: The platform will be temporarily unavailable from 2 AM to 4 AM this Saturday."
];

const messages = ref([]);
const messageRefs = ref([]);

// Function to collect refs
const setRef = (el) => {
  if (el) {
    messageRefs.value.push(el);
  }
};
const addMessage = async () => {
  // Pick a random message from the tradingMessages array
  const randomMessage = tradingMessages[Math.floor(Math.random() * tradingMessages.length)];
  messages.value.push(randomMessage);
  await nextTick();
  scrollToLastMessage();
};

const scrollToLastMessage = () => {
  const lastMessageElement = messageRefs.value.at(-1); // Get the last message element
  if (lastMessageElement) {
    lastMessageElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

onMounted(() => {
 
  const n = 4; // Number of seconds between messages
  setInterval(addMessage, n * 1000); 
});
</script>
<style scoped>
.cardtitle {
  font-size: 20px;
  font-weight: bold;
  background: navy;
  color: white;
}
</style>
<style scoped>
.message {
  background-color: white; /* Soft green background for received messages */
  border: 1px solid #dce775; /* Light green border */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow for depth */
  border-radius: 12px; /* Rounded corners for the bubble look */
  padding: 8px 12px; /* Comfortable spacing inside the bubble */
  max-width: 80%; /* Max width to prevent overly wide messages */
  margin: 8px 0; /* Spacing between messages */
  word-wrap: break-word; /* Ensure long words don't overflow */
  display: block; /* Block display to stack messages vertically */
  position: relative; /* For potential pseudo-elements or positioning */
  left: 0; /* Align messages to the left */
  margin-right: auto; /* Ensures margin is applied correctly for alignment */
  font-size: 0.95rem; /* Adjust font size as needed */
}
 
/* Transition group enter and leave active */
.message-enter-active, .message-leave-active {
  transition: background-color 1s;
}
.message-enter-from, .message-leave-to {
  background-color: yellow;
}
.message-enter-to, .message-leave-from {
  background-color: white;
}
</style>
