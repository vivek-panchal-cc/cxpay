import React, { useState } from "react";
import { useSelector } from "react-redux";
import Businessform from "./components/BusinessForm";
import PersonalForm from "./components/PersonalForm";

const EditProfile = () => {
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type = "business" } = profile || {};

  const getCurrentStepComponent = () => {
    switch (user_type) {
      case "business":
        return <Businessform />;
      case "personal":
        return <PersonalForm />;
      default:
        return null;
    }
  };

  return <div className="">{getCurrentStepComponent()}</div>;
};

export default EditProfile;
