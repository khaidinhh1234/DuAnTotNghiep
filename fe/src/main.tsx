import React from "react";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { StyleProvider } from "@ant-design/cssinjs";
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import "./assets/js/index.js
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>   
        <StyleProvider layer>
          <App />
        </StyleProvider>
    </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
