import { storageRequest } from "helpers/storageRequests";
import React, { useEffect, useMemo, useState } from "react";

const initialValues = {
  country_time_zone: "",
};

export const TimeZoneContext = React.createContext(initialValues);

const TimeZoneProvider = ({ children }) => {
  const timeZoneStorage = storageRequest.getTimeZone();
  const [countryTimeZone, setCountryTimeZone] = useState(timeZoneStorage || initialValues);
  const timeZoneValue = useMemo(
    () => ({ countryTimeZone, setCountryTimeZone }),
    [countryTimeZone, setCountryTimeZone]
  );

  useEffect(() => {
    const timeZoneStorage = storageRequest.getTimeZone();
    if (timeZoneStorage) return setCountryTimeZone(timeZoneStorage);
    setCountryTimeZone(initialValues);
  }, []);

  useEffect(() => {
    storageRequest.setTimeZoneStorage(countryTimeZone);
  }, [countryTimeZone]);

  return (
    <TimeZoneContext.Provider value={timeZoneValue}>
      {children}
    </TimeZoneContext.Provider>
  );
};

export default TimeZoneProvider;
