// Create a context or state to manage PIN validation
import React, { createContext, useContext, useMemo, useState } from "react";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [isPinValidated, setIsPinValidated] = useState(false);

  const value = useMemo(
    () => ({ isPinValidated, setIsPinValidated }),
    [isPinValidated]
  );

  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
};

export const usePinContext = () => useContext(PinContext);
