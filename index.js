// Global style imports
import "normalize.css";
import "leaflet/dist/leaflet.css";
import "./src/skeleton.scss";
import "./src/transitions.scss";

import Vue from "vue";
import VueAnalytics from "vue-analytics";

import App from "./src/App";

if (process.env.GA_TRACKING_ID) {
  Vue.use(VueAnalytics, {
    id: process.env.GA_TRACKING_ID,
  });
} else {
  console.log("No GA_TRACKING_ID found. Set one in your .env file.");
}

new Vue(App).$mount("#app");
