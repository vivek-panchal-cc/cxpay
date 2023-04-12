import React, { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

function useCountryBanks() {
  const [countryBanks, setCountryBanks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiRequest.getCountryBanks();
        if (!data.success) throw data.message;
        setCountryBanks(data?.data?.country_banks);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return [countryBanks];
}

export default useCountryBanks;
