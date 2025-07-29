import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";
import "./styles/index.css";
import { ThemeProvider } from "./components/theme-provider";

const root = createRoot(document.querySelector("#root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
