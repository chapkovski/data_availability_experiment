// store.js
import { defineStore } from "pinia";
import axios from "axios";
import { useWebSocket } from "@vueuse/core";
import { spread } from "lodash";
import _ from 'lodash';
const wsROOT = "ws://localhost:8000/trader";
import originalPriceData from '@/assets/data/price.csv';

export const useTraderStore = defineStore("trader", {
  state: () => ({
    actions: [],
    isTimerPaused: false,
    dayRemainingTime: null,
    timerCounter: 0,
    roundNumber: 1,
    priceData: _.filter(originalPriceData, { round: "1" }),
    priceHistory: [],
    day_duration: null, // Derived from tick_frequency * num_of_ticks_in_day
    num_of_ticks_in_day: null,
    midday_quiz_tick: null,
    dayOver: false,
    midPoint: 0,
    spread: 0,
    transaction_price: 0,
    midpoint: 0,
    gameParams: {},
    messages: [],
    status: null,
    history: [],
    shares: 0,
    cash: 0,
    initial_shares: 0,
    current_price: 0,
    showSnackbar: false,
    snackbarText: "",
    // data from the session initialization
    treatment: null,
    tick_frequency: null,
    market_signal_strength: null,
    tradingSessionUUID: null,
    traderUUID: null,
  }),
 
  getters: {

  },
  actions: {
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
    generateRandomPrice() {
      return Math.random() * (200 - 100) + 100;
    },
    generateRandomAction() {
      const randomPrice = parseFloat((Math.random() * 100 + 100).toFixed(2));
      const size = Math.floor(Math.random() * 100) + 1;
      const condition = Math.random() > 0.5 ? 'At ask' : 'At bid';
      
      const newAction = {
        random_id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        price: randomPrice,
        size: size,
        condition: condition,
      };

      // Add the new action to the top of the actions array
      this.actions.unshift(newAction);
      if (this.actions.length > 10) {
        this.actions.pop(); // Limit to 10 entries if desired
      }
    },
    startGeneratingActions() {
      // Initialize a periodic interval to add new actions
      setInterval(() => {
        this.generateRandomAction();
        this.addCurrentDataPoint()
      }, 1 * 1000);
    },

    // Function to generate the history array for the last 5 minutes and the next 5 minutes
   
    addCurrentDataPoint() {
      const now = Date.now(); // Current timestamp in milliseconds
    
      // Determine the open price based on the last close, or start at 100
      const open = this.history.length
        ? this.history[this.history.length - 1].close // Use last close as new open
        : 100;
    
      // Generate high, low, close values
      const high = open + Math.random() * 8; // High slightly above open
      const low = open - Math.random() * 8;  // Low slightly below open
      const close = Math.random() > 0.5 ? high - Math.random() * 4 : low + Math.random() * 4; // Close within high-low range
    
      // Create a data point in Highcharts format
      const dataPoint = {
        timestamp: new Date(now).toISOString(),  // Current time in ISO format
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(Math.max(high, open + 1).toFixed(2)), // Ensure high is above open
        low: parseFloat(Math.min(low, open - 1).toFixed(2)),   // Ensure low is below open
        close: parseFloat(close.toFixed(2)),
      };
    
      // Add the new data point to the history
      this.history.push(dataPoint);
    
      // Optional: Limit the history length for performance
      if (this.history.length > 100) {
        this.history.shift();
      }
    
      console.log("Added new data point:", dataPoint);
    },
    async initializeTradingSystem(formData) {
      // Destructure the formData
      const {
        treatment,
        tick_frequency,
        num_of_ticks_in_day, 
        midday_quiz_tick,
        market_signal_strength,
        tradingSessionUUID,
        traderUUID,
      } = formData;
    
      // Assign formData to gameParams
      this.gameParams = { ...formData };
    
      // Assign individual values to top-level state properties
      this.treatment = treatment;
      this.tick_frequency = tick_frequency;
      this.num_of_ticks_in_day = num_of_ticks_in_day;
      this.midday_quiz_tick = midday_quiz_tick;
      
      this.day_duration = tick_frequency * num_of_ticks_in_day; // Total duration in seconds
    
      // Calculate dayRemainingTime in milliseconds
      this.dayRemainingTime = this.day_duration * 1000;
    
      this.market_signal_strength = market_signal_strength;
      this.tradingSessionUUID = tradingSessionUUID;
      this.traderUUID = traderUUID;
    
      // Log to verify initialization
      console.debug("Trading system initialized with the following parameters:", {
        treatment: this.treatment,
        tick_frequency: this.tick_frequency,
        num_of_ticks_in_day: this.num_of_ticks_in_day,
        day_duration: this.day_duration,
        midday_quiz_tick: parseInt(this.midday_quiz_tick),
        market_signal_strength: this.market_signal_strength,
        tradingSessionUUID: this.tradingSessionUUID,
        traderUUID: this.traderUUID,
      });
    
      // Generate history after initialization
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
    async sendMessage(type, data) {
      // Use the 'send' function from the state

      if (this.ws.status === "OPEN") {
        this.ws.send(JSON.stringify({ type, data }));
      }
    },
  },
});
