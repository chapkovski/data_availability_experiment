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
    currentPrice: 0,
    spread: 1,
    day_duration: null, // Derived from tick_frequency * num_of_ticks_in_day
    num_of_ticks_in_day: null,
    midday_quiz_tick: null,
    dayOver: false,
    gameParams: {},
    messages: [],
    status: null,
    history: [],
    shares: 0,
    cash: 0,
    initial_shares: 0,
    initial_cash: 0,
    // data from the session initialization
    treatment: null,
    tick_frequency: null,
    market_signal_strength: null,
    tradingSessionUUID: null,
    traderUUID: null,
  }),

  getters: {
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
    makeTick() {
      this.timerCounter += 1;
      this.currentPrice = parseFloat(this.priceData[this.timerCounter].price);
      this.updatePriceHistory();
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

      }, 1 * 1000);
    },

    // Function to generate the history array for the last 5 minutes and the next 5 minutes


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
        initial_cash,
        initial_shares,
        spread
      } = formData;

      // Assign formData to gameParams

      this.gameParams = { ...formData };
      this.spread = spread;
      this.initial_cash = initial_cash;
      this.initial_shares = initial_shares;
      this.shares = initial_shares;
      this.cash = initial_cash;
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
        initial_cash: this.initial_cash,
        initial_shares: this.initial_shares,
        spread: this.spread
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
