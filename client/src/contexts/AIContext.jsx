import React, { createContext, useContext, useState } from "react";

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <AIContext.Provider value={{ aiEnabled, setAiEnabled }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

export default AIContext;