import { apiRequest } from "helpers/apiRequests";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Businessform from "./components/BusinessForm";
import PersonalForm from "./components/PersonalForm";

const EditProfile = () => {
  const { profile } = useSelector((state) => state.userProfile);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState({});
  const { user_type = "personal" } = profile || {};

  const getCountries = async () => {
    try {
      const { data } = await apiRequest.getCountry();
      if (!data.success || data.data === null) throw data.message;
      setCountryList(data?.data?.country_list);
      setCityList(data?.data?.city_list);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentStepComponent = () => {
    switch (user_type) {
      case "business":
        return <Businessform {...{ countryList, cityList }} />;
      case "personal":
        return <PersonalForm {...{ countryList, cityList }} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  return <div className="mb-4">{getCurrentStepComponent()}</div>;
};

export default EditProfile;
