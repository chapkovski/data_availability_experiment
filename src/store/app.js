// store.js
import { defineStore } from "pinia";
import axios from "axios";
import { useWebSocket } from "@vueuse/core";
import { spread } from "lodash";

const wsROOT = "ws://localhost:8000/trader";


export const useTraderStore = defineStore("trader", {
  state: () => ({
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
    day_duration: null,
    market_signal_strength: null,
    data_latency: null,
    tradingSessionUUID: null,
  }),
  getters: {

  },
  actions: {
    generateRandomPrice() {
      return Math.random() * (200 - 100) + 100;
    },

    // Function to generate the history array for the last 5 minutes and the next 5 minutes
    generateHistory() {
      const now = new Date();
      const history = [];

      // Generate data for the last 5 minutes
      for (let i = -5; i <= 5; i++) {
        const timestamp = new Date(now.getTime() + i * 60 * 1000); // 1 minute intervals
        const price = this.generateRandomPrice(); // Generate random price

        history.push({
          timestamp: timestamp.toISOString(),  // Convert to ISO string
          price: price,
        });
      }

      // Set the generated history array to the store's state
      this.history = history;

      console.log("Generated history:", this.history);
    },
  },

  initializeTradingSystem(formData) {
    // Destructure the formData
    const {
      treatment,
      tick_frequency,
      day_duration,
      market_signal_strength,
      data_latency,
      tradingSessionUUID
    } = formData;

    // Assign formData to gameParams
    this.gameParams = { ...formData };

    // Assign individual values to top-level state properties
    this.treatment = treatment;
    this.tick_frequency = tick_frequency;
    this.day_duration = day_duration;
    this.market_signal_strength = market_signal_strength;
    this.data_latency = data_latency;
    this.tradingSessionUUID = tradingSessionUUID;

    // Log to verify initialization
    console.log("Trading system initialized with the following parameters:", {
      treatment: this.treatment,
      tick_frequency: this.tick_frequency,
      day_duration: this.day_duration,
      market_signal_strength: this.market_signal_strength,
      data_latency: this.data_latency,
      tradingSessionUUID: this.tradingSessionUUID,
    });

    // Generate history after initialization
    this.generateHistory();
  },

  handle_update(data) {
    const {

      history,
      spread,
      midpoint,
      transaction_price,
      inventory,
      trader_orders,

      initial_shares,
    } = data;

    if (transaction_price && midpoint && spread) {
      const market_level_data = {
        transaction_price,
        midpoint,
        spread
      };
      this.updateExtraParams(market_level_data);
    }



    const orderTypeMapping = {
      '-1': 'ask',
      '1': 'bid'
    };
    if (trader_orders && trader_orders.length > 0) {
      const remappedOrders = trader_orders.map(order => ({
        ...order,
        order_type: orderTypeMapping[order.order_type.toString()],
        status: 'active'
      }));
      this.myOrders = remappedOrders;
    }



    if (inventory) {
      const { shares, cash } = inventory;
      this.shares = shares;
      this.cash = cash;
    }
    if (order_book) {
      const { bids, asks } = order_book;


      this.initial_shares = initial_shares;

      this.midPoint = midpoint || findMidpoint(bids, asks);
      this.chartData = [

        {
          name: "Bids",
          color: "blue",
          data: this.bidData,
        },
        {
          name: "Asks",
          color: "red",
          data: this.askData,
        },
      ];

      this.history = history;
      this.spread = spread;


    }
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
