import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { StyleProvider } from "@ant-design/cssinjs";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./global.css";
// import "./assets/js/index.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StyleProvider layer>
        <App />
      </StyleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
