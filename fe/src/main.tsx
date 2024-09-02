import React from "react";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { StyleProvider } from "@ant-design/cssinjs";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./global.css";
// import "./assets/js/index.js";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <StyleProvider layer>
          <App />
        </StyleProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
