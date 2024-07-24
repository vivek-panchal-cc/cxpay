import useCountriesCities from "hooks/useCountriesCities";
import React from "react";
import { useSelector } from "react-redux";
import AgentForm from "./components/AgentForm";
import Businessform from "./components/BusinessForm";
import PersonalForm from "./components/PersonalForm";

const EditProfile = () => {
  const { profile } = useSelector((state) => state.userProfile);
  const [countryList, cityList] = useCountriesCities();
  const { user_type = "personal" } = profile || {};

  const getCurrentStepComponent = () => {
    switch (user_type) {
      case "business":
        return <Businessform {...{ countryList, cityList }} />;
      case "personal":
        return <PersonalForm {...{ countryList, cityList }} />;
      case "agent":
        return <AgentForm {...{ countryList, cityList }} />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-4 settings-vc-sec">{getCurrentStepComponent()}</div>
  );
};

export default EditProfile;
