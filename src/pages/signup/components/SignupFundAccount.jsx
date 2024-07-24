import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CXPAY_LOGO, FUND_CARD, FUND_MANUAL } from "constants/all";
import FundProvider from "context/fundContext";
import { LoaderContext } from "context/loaderContext";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { storageRequest } from "helpers/storageRequests";
import { useDispatch } from "react-redux";
import FundCard from "./FundCard";
import FundManual from "./FundManual";
import InputSelect from "components/ui/InputSelect";

function SignupFundAccount() {
  const { setIsLoading } = useContext(LoaderContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [accessible, setAccessible] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const creds = storageRequest.getCredsFromtStorage();

  const getUserDataFirstTime = async () => {
    setIsLoading(true);
    try {
      const { payload } = await dispatch(fetchUserProfile());
      if (
        !creds ||
        !payload ||
        !payload?.mobile_number?.includes(creds.mobile_number)
      )
        throw payload;
    } catch (error) {
      setAccessible(false);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };

  /** Fund type change handler */
  const handleFundTypeChange = (e) => {
    const fundType = e.currentTarget.value;
    navigate(`/signup/${fundType}`, { replace: true });
  };

  const getFundForm = () => {
    const type = params ? params.fundtype : "";
    switch (type) {
      case FUND_CARD:
        return <FundCard />;
      // case FUND_MANUAL:
      //   return <FundManual />;
      default:
        return <Navigate to={"/"} replace={true} />;
    }
  };

  useEffect(() => {
    getUserDataFirstTime();
  }, []);

  if (!isLoaded) return null;
  if (!accessible) return navigate("/", { replace: true });
  return (
    <div className="login-signup common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap fund-account-form">
              {/* <div className="login-signup-inner"> */}
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="/">
                  <img src={CXPAY_LOGO} alt="login logo img" />
                </a>
              </div>
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">fund your Account</h4>
              {/* <form action="">
                <InputSelect
                  className="form-select form-control text-capitalize"
                  name="fund_type"
                  value={params?.fundtype}
                  onChange={handleFundTypeChange}
                >
                  <option value={FUND_CARD}>
                    {FUND_CARD.replace(/-/g, " ")}
                  </option>
                  <option value={FUND_MANUAL}>
                    {FUND_MANUAL.replace(/-/g, " ")}
                  </option>
                </InputSelect>
              </form> */}
              {/* </div> */}
              <FundProvider>{getFundForm()}</FundProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupFundAccount;
