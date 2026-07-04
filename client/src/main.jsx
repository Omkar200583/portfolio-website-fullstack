import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// Contexts
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AIProvider } from "./contexts/AIContext";

// Styles
import "./styles/themes.css"
import "./styles/globals.css"

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