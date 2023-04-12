import { DefaultLoader } from "loaders";
import React, { useState } from "react";

const initialValues = {
  step: 0,
};

export const LoaderContext = React.createContext(initialValues);

const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ setIsLoading, isLoading }}>
      {isLoading && <DefaultLoader />}
      {children}
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;
