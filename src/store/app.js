// store.js
import { defineStore } from "pinia";
import axios from "axios";
import { useWebSocket } from "@vueuse/core";
import { round, spread } from "lodash";
import _ from 'lodash';
import Scheduler from "./utils";
const scheduler = new Scheduler();
const wsROOT = "ws://localhost:8000/trader";
function scheduleRelativeTasks(duration, orders, callback, threshold = 0.875) {
  orders.forEach((order) => {
    // Use the threshold if relativeTime exceeds it
    const relativeTime = Math.min(parseFloat(order.relativeTime), threshold);
    const delay = duration * relativeTime; // Calculate the delay based on the adjusted relativeTime

    setTimeout(() => {
      callback(order); // Call the callback with the order as an argument
    }, delay * 1000); // Convert delay to milliseconds
  });
}
const x = 5; // For the last 60 minutes

const data = [];
for (let i = 0; i < x; i++) {
  data.push(null); // Random price between 50 and 100
}


export const useTraderStore = defineStore("trader", {
  state: () => ({


    // Hardcoded trading session parameters
    tick_frequency: 8,
    num_of_ticks_in_day: 40,
    day_duration: 8 * 40,
    dayRemainingTime: 8 * 40 * 1000,
    midday_quiz_tick: 20,
    market_signal_strength: "High",
    initial_cash: 1000,
    initial_shares: 1,
    spread: 0.02,
    tradingSessionUUID: "hardcoded-session-uuid",
    traderUUID: "hardcoded-trader-uuid",

    // Game-related state

    orders: [],
    priceHistory: Array(5).fill(null),
    currentPrice: 0,


    dayOver: false,

    roundNumber: 1,
    timerCounter: 0,
    tickHappenedAt: null, // New property to store timestamp of the last tick
    isTimerPaused: false,
    messages: [],
    status: null,
    history: [],
    shares: 0,
    cash: 0,
    gameParams: {},
    ...(typeof js_vars !== "undefined" ? js_vars : {}),
  }),

  getters: {
    totalWealth(state) {
      return (state.shares * state.currentPrice) + state.cash;
    },
    isBuyPossible(state) {
      // Buy is possible if:
      // 1. Shares are 0
      // 2. Cash is greater than or equal to the current price
      return parseInt(state.shares) === 0 && parseFloat(state.cash) >= parseFloat(state.currentPrice);
    },
    isSellPossible(state) {
      // Sell is possible if:
      // 1. Shares are greater than 0
      // 2. If selling, buying should be blocked
      return parseInt(state.shares) > 0;
    },
    bestBuyingPrice: (state) => {
      // Calculate the best buying price
      return parseFloat(state.currentPrice) - state.spread / 2;
    },
    bestSellingPrice: (state) => {
      // Calculate the best selling price
      return parseFloat(state.currentPrice) + state.spread / 2;
    },
  },
  actions: {
    pauseGame() {
      this.isTimerPaused = true;
      scheduler.pauseTasks(); // Pause scheduled tasks
      console.debug("Game paused");
    },
    resumeGame() {
      this.isTimerPaused = false;

      scheduler.resumeTasks((order) => {
        console.debug("Resumed order:", order);
        // Add order to the queue or handle it here
        this.addOrderToQueue(order);
      });

      // If no remaining tasks were paused, reschedule the current tick's orders
      if (!scheduler.scheduledTasks.length) {
        scheduler.scheduleRelativeTasks(
          this.tick_frequency, // Duration
          scheduler.currentTickOrders, // Orders
          (order) => {
            console.debug("Executing order:", order);
            this.addOrderToQueue(order);
          }
        );
      }

      console.debug("Game resumed");
    },
    makeTick() {

      this.tickHappenedAt = Date.now(); // Store the timestamp of this tick
      this.orders = [];
      this.currentPrice = parseFloat(this.priceData[this.timerCounter].price);
      this.updatePriceHistory();
      this.timerCounter++;
      this.sendMessage(
        {
          
          message: 'next_tick',
          
        }
      );
    },
    updatePriceHistory() {
      if (this.timerCounter < this.priceData.length) {
        const now = Date.now();
        const currentPrice = parseFloat(this.priceData[this.timerCounter].price);

        // Add a new point to priceHistory
        this.priceHistory.push({ x: now, y: currentPrice });

        // Increment the timer counter

      } else {
        console.warn("No more data points to add from priceData.");
      }
    },

    processOrdersForCurrentTick() {
      const currentRound = this.roundNumber;
      const currentTick = this.timerCounter;
      console.debug('lets see', this.orderData);
      // Filter relevant bids using Lodash
      const relevantOrders = _.filter(this.orderData, {

        Tick: currentTick,
      });
      console.debug('relevantOrders', relevantOrders);
      if (_.isEmpty(relevantOrders)) {
        console.debug("No relevant orders found for this round and tick.");
        return;
      }

      console.debug("Relevant orders:", relevantOrders);

      // Schedule the actions for each order with the Order property determining the delay
      scheduler.scheduleRelativeTasks(this.tick_frequency, relevantOrders, (order) => {
        console.debug(`Executing order:`, order);
        this.addOrderToQueue(order); // Add bid to queue or handle it in your store
      });
    },
    addOrderToQueue(order) {
      const newOrder = {
        random_id: Math.random().toString(36).substr(2, 9), // Unique identifier
        timestamp: Date.now(), // Current timestamp
        price: order.Price, // Use the `Order` field as the price
        size: parseInt(order.Quantity), // Use the `Quantity` field
        condition: order.Type, // Use the `Type` field (e.g., "At ask" or "At bid")
      };

      // Add the new action to the top of the orders array
      this.orders.unshift(newOrder);


    },


    // Function to generate the history array for the last 5 minutes and the next 5 minutes


    async initializeTradingSystem(formData) {
      // Perform any necessary setup logic here
      console.log("Trading system initialized with:", {
        tick_frequency: this.tick_frequency,
        num_of_ticks_in_day: this.num_of_ticks_in_day,
        midday_quiz_tick: this.midday_quiz_tick,
        market_signal_strength: this.market_signal_strength,
        initial_cash: this.initial_cash,
        initial_shares: this.initial_shares,
        spread: this.spread,
        tradingSessionUUID: this.tradingSessionUUID,
        traderUUID: this.traderUUID,
      });

      // Initialize state
      this.cash = this.initial_cash;
      this.shares = this.initial_shares;
      this.day_duration = this.tick_frequency * this.num_of_ticks_in_day;
    },

    async initializeWebSocket() {
      const that = this;
      this.ws = useWebSocket(this.ws_path, {
        autoReconnect: true,
        onConnected: async () => {
          console.debug("Connected!");
          that.status = "connected";
        },

        onMessage: (e) => {
          const json_data = JSON.parse(this.ws.data);

          this.messages.push(json_data);

          if (json_data) {
            const newMessage = json_data;
            // console.debug("message", newMessage);
            // todo.philipp: ideally we MAY think about passing a dynamic handler
            // but for now we just update the incoming data. for most of the cases this is enough
            if (newMessage.type === "closure") {
              // router push to the result page
              console.debug("CLOSURE", newMessage);
              this.dayOver = true;
            }
            this.handle_update(newMessage);
          }
        },
      });
    },
    async sendMessage ( data) {
      
      console.debug("Sending message:", { data });
      liveSend({
        utcTime: new Date().toISOString(),
        
        price: this.currentPrice,
        shares: this.shares,
        cash: this.cash,
        tick_number: this.timerCounter,
        totalWealth: this.totalWealth,
        ...data
      });
    },
  },
});
