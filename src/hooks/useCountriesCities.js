import { apiRequest } from "helpers/apiRequests";
import { useState, useEffect } from "react";

const useCountriesCities = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiRequest.getCountry();
        if (!data.success) throw data.message;
        setCountries(data?.data?.country_list);
        setCities(data?.data?.city_list);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return [countries, cities];
};

export default useCountriesCities;
