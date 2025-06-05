import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CXPAY_LOGO } from "constants/all";
import { apiRequest } from "helpers/apiRequests";

function UnderMaintenance(_props) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message");
  const isUnderMaintenance = searchParams.get("is_under_maintenance");

  useEffect(() => {
    const getCountries = async () => {
      try {
        const { data } = await apiRequest.getCountry();
        if (!data.success) throw data.message;
        if (data.status_code === 200) {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    const interval = setInterval(() => {
      getCountries();
    }, 10000); // Fetch countries every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (!isUnderMaintenance) return <Navigate to="/" replace />;

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              <div className="login-logo-image text-center">
                <img src={CXPAY_LOGO} alt="kyc logo img" />
              </div>
              <h5 className="blue-text text-center m-4">
                {message || (
                  <>
                    We’ll be back soon! Our application is currently undergoing
                    scheduled maintenance. We’re working hard to improve your
                    experience and will be back online shortly. Thank you for
                    your patience.
                  </>
                )}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnderMaintenance;
