import React, { useContext, useState } from "react";
import EnterPhone from "./components/EnterPhone";
import AccountType from "./components/AccountType";
import Businessform from "./components/BusinessForm";
import PersonalForm from "./components/PersonalForm";
import SignupProvider, { SignupContext } from "context/signupContext";

const Signup = () => {
  const { signUpCreds } = useContext(SignupContext);

  const getCurrentStepComponent = () => {
    switch (signUpCreds.step) {
      case 0:
        return <EnterPhone />;
      case 1:
        return <AccountType />;
      case 2:
        switch (signUpCreds.user_type) {
          case "business":
            return <Businessform />;
          case "personal":
            return <PersonalForm />;
          default:
            return <EnterPhone />;
        }
      default:
        return <EnterPhone />;
    }
  };

  return (
    <div className="login-signup common-body-bg">
      {getCurrentStepComponent()}
    </div>
  );
};

export default Signup;
