import React, { useState } from "react";
import EnterPhone from "./components/EnterPhone";
import AccountType from "./components/AccountType";
import Businessform from "./components/BusinessForm";
import PersonalForm from "./components/PersonalForm";

const Signup = () => {
  const [signUpCreds, setSignUpCreds] = useState({
    step: 0,
    mobile_number: "",
    user_otp: "",
    user_type: "",
  });

  const getCurrentStepComponent = () => {
    switch (signUpCreds.step) {
      case 0:
        return <EnterPhone {...{ signUpCreds, setSignUpCreds }} />;
      case 1:
        return <AccountType {...{ signUpCreds, setSignUpCreds }} />;
      case 2:
        switch (signUpCreds.user_type) {
          case "business":
            return <Businessform {...{ signUpCreds, setSignUpCreds }} />;
          case "personal":
            return <PersonalForm {...{ signUpCreds, setSignUpCreds }} />;
          default:
            return <EnterPhone {...{ signUpCreds, setSignUpCreds }} />;
        }
      default:
        return <EnterPhone {...{ signUpCreds, setSignUpCreds }} />;
    }
  };

  return (
    <div className="login-signup common-body-bg">
      {getCurrentStepComponent()}
    </div>
  );
};

export default Signup;
