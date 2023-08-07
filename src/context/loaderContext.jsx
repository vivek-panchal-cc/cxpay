import { DefaultLoader } from "loaders";
import React, { useMemo, useState } from "react";

export const LoaderContext = React.createContext({
  isLoading: false,
  setIsLoading: () => {},
});

const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const loaderValues = useMemo(
    () => ({ isLoading, setIsLoading }),
    [isLoading, setIsLoading]
  );

  return (
    <LoaderContext.Provider value={loaderValues}>
      {isLoading ? <DefaultLoader /> : null}
      {children}
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;
