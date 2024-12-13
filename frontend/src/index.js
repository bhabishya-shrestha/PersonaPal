import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css"; // Global styles for the app
import App from "./App";
// import reportWebVitals from "./utils/reportWebVitals";

// Create the root and render the main App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional performance monitoring
// reportWebVitals(console.log); // Log performance metrics to the console
