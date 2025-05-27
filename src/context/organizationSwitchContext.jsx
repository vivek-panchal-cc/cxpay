import { storageRequest } from "helpers/storageRequests";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";

const OrganizationSwitchContext = createContext();

export const OrganizationSwitchProvider = ({ children }) => {
  // Initialize state with value from sessionStorage or default to false
  const orgToggle = storageRequest.getOrgToggle();
  const [isToggled, setIsToggled] = useState(orgToggle || false);
  const location = useLocation();

  const toggle = useCallback(() => {
    setIsToggled((prev) => {
      const newValue = !prev; // Compute the new value
      storageRequest.setOrgToggle(newValue); // Save to sessionStorage
      return newValue;
    });
  }, []);

  const toggleValue = useMemo(
    () => ({ isToggled, toggle }),
    [isToggled, toggle]
  );

  useEffect(() => {
    const orgToggle = storageRequest.getOrgToggle();
    if (orgToggle) return setIsToggled(orgToggle);
    setIsToggled(false);
  }, [location.pathname]);

  useEffect(() => {
    // Save the current state to sessionStorage whenever it changes
    storageRequest.setOrgToggle(isToggled);
  }, [isToggled]);

  return (
    <OrganizationSwitchContext.Provider value={toggleValue}>
      {children}
    </OrganizationSwitchContext.Provider>
  );
};

// Custom hook for consuming the context
export const useOrganizationSwitch = () => {
  return useContext(OrganizationSwitchContext);
};
