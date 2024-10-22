// store.js
import { defineStore } from "pinia";
import axios from "axios";
import { useWebSocket } from "@vueuse/core";

const wsROOT = "ws://localhost:8000/trader";
function findMidpoint(bids, asks) {
  // Ensure the arrays are not empty
  if (!bids.length || !asks.length) {
    console.debug('One or both arrays are empty.');
    return 0; // Or any other default value you deem appropriate
  }

  // Find the largest x value in the bids array
  const largestBidX = Math.max(...bids.map(bid => bid.x));

  // Find the lowest x value in the asks array
  const lowestAskX = Math.min(...asks.map(ask => ask.x));

  // Calculate the midpoint
  const midpoint = (largestBidX + lowestAskX) / 2;

  return midpoint;
}

export const useTraderStore = defineStore("trader", {
  state: () => ({
    dayOver: false,
    midPoint: 0,
   
    extraParams: [
      {
        var_name: 'transaction_price',
        display_name: 'Transaction price',
        explanation: 'Price of the last transaction',
        value: null
      },
      {
        var_name: 'spread',
        display_name: 'Spread',
        explanation: 'Difference between the best bid and best ask',
        value: null
      },
      {
        var_name: 'midpoint',
        display_name: 'Midpoint',
        explanation: 'Midpoint between the best bid and best ask',
        value: null
      },

    ],
    step: 1000,
    
    gameParams: {},
    messages: [],
    status: null,
    
    history: [],
    
    spread: null,
    shares: 0,
    cash: 0,
    initial_shares: 0,
    current_price: null,
    showSnackbar: false,
    snackbarText: "",
  }),
  getters: {
    
  },
  actions: {
     
    async initializeTradingSystem(formState) {
      
      try {
        this.gameParams = formState;
        // Connect to WebSocket or perform other actions
      } catch (error) {
        // Handle error appropriately
      }
    },
    async getTradingSessionData(tradingSessionUUID) {
      const httpUrl = import.meta.env.VITE_HTTP_URL;
      try {
        const response = await axios.get(`${httpUrl}trading_session/${tradingSessionUUID}`);
        console.debug(response.data.data);
        this.tradingSessionData = response.data.data;
      } catch (error) {
        console.error(error);
      }
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
