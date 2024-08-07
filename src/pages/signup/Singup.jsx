import React, { useContext } from "react";
import EnterPhone from "./components/EnterPhone";
import AccountType from "./components/AccountType";
import Businessform from "./components/BusinessForm";
import PersonalForm from "./components/PersonalForm";
import { SignupContext } from "context/signupContext";
import { Navigate } from "react-router-dom";
import { FUND_CARD } from "constants/all";

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
        if (
          signUpCreds.system_manual_kyc?.toString() === "true" &&
          signUpCreds.kyc_approved_status === "pending"
        ) {
          return <Navigate to="/kyc-manual" replace={true} state={{ kycStatus: true }}/>;
        } else {
          if (
            signUpCreds.system_manual_kyc?.toString() === "false" &&
            (signUpCreds.kyc_approved_status === "approved" ||
              signUpCreds.kyc_approved_status === "pending")
          ) {
            return <Navigate to="/complete-kyc-initial" replace={true} />;
          } else {
            return <Navigate to="/complete-kyc-initial" replace={true} />;
          }
        }

      // return <Navigate to={`/signup/${FUND_CARD}`} replace={true} />;
      // return <Navigate to="/" replace={true} />;
      // return <Navigate to="/kyc-manual" replace={true} />;
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
