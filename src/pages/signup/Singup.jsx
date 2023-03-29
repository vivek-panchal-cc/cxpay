import React, { useContext } from "react";
import EnterPhone from "./components/EnterPhone";
import AccountType from "./components/AccountType";
import Businessform from "./components/BusinessForm";
import PersonalForm from "./components/PersonalForm";
import { SignupContext } from "context/signupContext";
import { Navigate } from "react-router-dom";
import { FUND_BANK } from "constants/all";

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
      case 3:
        return <Navigate to={`/signup/${FUND_BANK}`} replace={true} />;
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
