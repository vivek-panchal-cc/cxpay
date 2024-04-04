import React, { useContext, useEffect } from "react";
import { SignupContext } from "context/signupContext";
import { LoaderContext } from "context/loaderContext";
import { Link } from "react-router-dom";
import { CXPAY_LOGO } from "constants/all";
import { storageRequest } from "helpers/storageRequests";

function KycManualFirstStep(_props) {
  const { message, kycUpdate = "" } = _props;
  const { setIsLoading } = useContext(LoaderContext);
  const { signUpCreds } = useContext(SignupContext);

  const removeAuthentication = () => {
    storageRequest.removeAuth();
  };

  const handleBeforeUnload = (event) => {
    // Conditionally remove authentication based on kycUpdate prop
    if (kycUpdate !== "renew") {
      removeAuthentication();
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (kycUpdate !== "renew") {
        removeAuthentication();
      }
    };
  }, []);

  useEffect(() => {
    if (kycUpdate !== "renew") {
      removeAuthentication();
    }
  }, []);

  const handleRedirect = () => {
    if (kycUpdate !== "renew") {
      removeAuthentication();
    }
    window.location.href = "/";
  };

  return (
    <div className="container login-signup-01 login-signup-02">
      <div className="row">
        <div className="col-xs-12">
          <div className="login-signup-content-wrap login-signup01-content-wrap">
            <div className="login-logo-image text-center">
              <img src={CXPAY_LOGO} alt="kyc logo img" />
            </div>
            {message ? (
              <h5 className="blue-text text-center px-2">{message}</h5>
            ) : (
              <h5 className="blue-text text-center px-2">
                This process will take 2-3 working days.
              </h5>
            )}
            <div className="login-other-option">
              <div className="pt-4 login-with-opt-wrap">
                <button
                  className="btn btn-primary blue-bg"
                  onClick={handleRedirect}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KycManualFirstStep;
