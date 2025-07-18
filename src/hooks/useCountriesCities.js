import { apiRequest } from "helpers/apiRequests";
import { useState, useEffect } from "react";

const useCountriesCities = (showOnlySignupCountries = false) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiRequest.getCountry();
        if (!data.success) throw data.message;
        const filteredCountries = showOnlySignupCountries
          ? data?.data?.country_list?.filter(
              (country) => country.is_signup_country
            )
          : data?.data?.country_list;
        setCountries(filteredCountries);
        setCities(data?.data?.city_list);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [showOnlySignupCountries]);

  return [countries, cities];
};

export default useCountriesCities;
