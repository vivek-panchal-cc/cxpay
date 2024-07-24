import React, { useContext, useEffect, useState } from "react";
import { SignupContext } from "context/signupContext";
import { LoaderContext } from "context/loaderContext";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CXPAY_LOGO } from "constants/all";
import { storageRequest } from "helpers/storageRequests";
import { useDispatch } from "react-redux";
import { fetchLogout } from "features/user/userProfileSlice";
import { apiRequest } from "helpers/apiRequests";
import { SystemOptionsContext } from "context/systemOptionsContext";

function KycManualSecondStep(_props) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [customerKycMessage, setCustomerKycMessage] = useState("");
  const [processKycCheck, setProcessKycCheck] = useState();
  const { setIsLoading } = useContext(LoaderContext);
  const { signUpCreds } = useContext(SignupContext);
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message");
  const { MANUAL_KYC } = useContext(SystemOptionsContext);
  const kycType = MANUAL_KYC?.toString() === "true" ? "MANUAL" : "SYSTEM";

  // useEffect(() => {
  //   (async () => {
  //     const { data } = await apiRequest.checkCustomerKyc();
  //     setProcessKycCheck(data.data.process_kyc);
  //     setCustomerKycMessage(data.message);
  //   })();
  // });

  useEffect(() => {
    const fetchCustomerKyc = async () => {
      try {
        const { data } = await apiRequest.checkCustomerKyc();
        setProcessKycCheck(data.data.process_kyc);
        setCustomerKycMessage(data.message);
      } catch (error) {
        console.error("Error fetching customer KYC data:", error);
        // Handle errors if needed
      }
    };
    fetchCustomerKyc();
  }, []);

  const redirectManualKyc = (e) => {
    try {
      if (!processKycCheck) {
        window.location.href = `/send-mail?message=${encodeURIComponent(
          customerKycMessage
        )}&system_option_manual_kyc_status=${encodeURIComponent(
          kycType
        )}&is_renew=${encodeURIComponent(false)}`;
      } else {
        navigate("/kyc-manual", {
          state: { kycStatus: true },
        });
      }
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    }
  };

  const logout = () => {
    (() => {
      navigate("/logout", { replace: true });
    })();
  };

  if (!message) return <Navigate to="/" replace />;

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              <div className="login-logo-image text-center">
                <img src={CXPAY_LOGO} alt="kyc logo img" />
              </div>
              {message ? (
                <h5
                  style={{ marginRight: "20px", marginLeft: "20px" }}
                  className="blue-text text-center"
                >
                  {message}
                </h5>
              ) : (
                <h5 className="blue-text text-center">
                  Your KYC details has not been approved. Please try again.
                </h5>
              )}
              <div className="login-other-option">
                <div className="pt-4 login-with-opt-wrap">
                  <button
                    type="button"
                    className="btn btn-primary blue-bg"
                    onClick={redirectManualKyc}
                  >
                    Process KYC
                  </button>
                </div>
              </div>
              <div className="pop-cancel-btn text-center">
                <button type="button" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KycManualSecondStep;
