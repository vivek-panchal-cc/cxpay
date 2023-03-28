import InputSelect from "components/ui/InputSelect";
import FundProvider from "context/fundContext";
import { LoaderContext } from "context/loaderContext";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { storageRequest } from "helpers/storageRequests";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FundBank from "./FundBank";
import FundCard from "./FundCard";

function SignupFundAccount() {
  const { setIsLoading } = useContext(LoaderContext);
  const [accessible, setAccessible] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const creds = storageRequest.getCredsFromtStorage();

  const getUserDataFirstTime = async () => {
    try {
      const { payload } = await dispatch(fetchUserProfile());
      if (!creds || !payload || payload.mobile_number !== creds.mobile_number)
        throw payload;
    } catch (error) {
      console.log("User profile not found", error);
      setAccessible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundTypeChange = (e) => {
    const fundType = e.currentTarget.value;
    navigate(`/signup/${fundType}`, { replace: true });
  };

  const getFundForm = () => {
    const type = params ? params.fundtype : "";
    switch (type) {
      case "card":
        return <FundCard />;
      case "bank":
        return <FundBank />;
      case "cash":
        return <>CASH</>;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getUserDataFirstTime();
  }, []);

  if (!accessible) return navigate("/", { replace: true });

  return (
    <div className="login-signup common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              {/* <div className="login-signup-inner"> */}
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="/">
                  <img src="/assets/images/logo-1.png" alt="login logo img" />
                </a>
              </div>
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">fund your Account</h4>
              <form action="">
                <InputSelect
                  className="form-select form-control"
                  name="fund_type"
                  value={params?.fundtype}
                  onChange={handleFundTypeChange}
                >
                  <option value={"card"}> Card </option>
                  <option value={"bank"}> Bank </option>
                  <option value={"cash"}> Cash </option>
                </InputSelect>
              </form>
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
