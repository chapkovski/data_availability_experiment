import TradingSystem from "@/components/tradingSystem.vue";
import { createRouter, createWebHashHistory } from "vue-router";
 

const routes = [
  {
    path: "/",
    redirect: "/trader/12345", // Redirect to TradingSystem with a hardcoded traderUUID
  },
  {
    path: "/trader/:traderUUID",
    name: "TradingSystem",
    component: TradingSystem,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;