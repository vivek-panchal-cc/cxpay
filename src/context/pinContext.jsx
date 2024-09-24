// Create a context or state to manage PIN validation
import React, { createContext, useContext, useState } from "react";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [isPinValidated, setIsPinValidated] = useState(false);

  return (
    <PinContext.Provider value={{ isPinValidated, setIsPinValidated }}>
      {children}
    </PinContext.Provider>
  );
};

export const usePinContext = () => useContext(PinContext);
