import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// Contexts
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AIProvider } from "./contexts/AIContext";

// Styles — ORDER MATTERS.
// index.css must come first: it declares the Tailwind v4 cascade layers.
// globals.css, Amination.css and the old responsive css are intentionally gone.
import "./index.css";
import "./styles/themes.css";
import "./styles/animations.css";
import "./styles/layout.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AIProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AIProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);