import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { LoginWithEmailSchema } from "schemas/validationSchema";
import { useDispatch } from "react-redux";
import { fetchLogin } from "features/user/userProfileSlice";
import { storageRequest } from "helpers/storageRequests";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { LoaderContext } from "context/loaderContext";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import { CXPAY_LOGO } from "constants/all";
import { SystemOptionsContext } from "context/systemOptionsContext";
import { LoginContext } from "context/loginContext";
import { TimeZoneContext } from "context/timeZoneContext";
import Modal from "components/modals/Modal";
import VerifyLoginWithOtp from "./components/VerifyLoginWithOtp";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";

const LoginWithEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [loginType, setLoginType] = useState("email");
  const [showVerifyPhonePopup, setShowVerifyPhonePopup] = useState(false);
  const [countryList, cities] = useCountriesCities(true);
  const { setLoginCreds } = useContext(LoginContext);
  const { setCountryTimeZone } = useContext(TimeZoneContext);

  useEffect(() => {
    const token = storageRequest.getAuth();
    if (token) navigate("/", { replace: true });
  }, []);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      login_type: loginType,
    },
    validationSchema: LoginWithEmailSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm, setErrors, setStatus }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.loginOtp(values);
        if (!data.success) throw data.message;
        setEmailOrMobile(data.data?.email || data.data?.mobile_number);
        setCountryCode(data.data?.country_code);
        const selectedCountry = countryList.find(
          (country) => country.phonecode.toString() === data.data?.country_code
        );
        const country_time_zone = selectedCountry
          ? selectedCountry.time_zone
          : "";
        setCountryTimeZone({ country_time_zone });
        if (data?.data?.login_otp) toast.success(data.data.login_otp);
        toast.success(data.message);
        setStatus(null);
        setShowVerifyPhonePopup(true);
      } catch (error) {
        resetForm();
        if (typeof error === "string") setStatus(error);
        setErrors({
          email: error?.email?.[0],
          password: error?.password?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap">
              <div className="login-signup-inner">
                <h4 className="text-center">Welcome to</h4>
                <div className="login-logo-image text-center">
                  <a href="/">
                    <img src={CXPAY_LOGO} alt="login logo img" />
                  </a>
                </div>
                <h5 className="text-center">Login with Email</h5>
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-field">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      error={formik.touched.email && formik.errors.email}
                      autoComplete={"new-email"}
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="form-control w-100"
                      placeholder="Password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={(e) => {
                        formik.handleBlur(e); // Pass the event to formik.handleBlur
                        setIsInputFocused(false);
                      }}
                      value={formik.values.password}
                      error={formik.touched.password && formik.errors.password}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onFocus={() => setIsInputFocused(true)}
                      autoComplete="new-password"
                    />
                    <span
                      className="eye-icon"
                      style={{
                        top: "12px",
                        right: isSafari && isInputFocused ? "45px" : "",
                      }}
                    >
                      {showPassword ? (
                        <IconEyeOpen
                          onClick={() => setShowPassword((e) => !e)}
                        />
                      ) : (
                        <IconEyeClose
                          onClick={() => setShowPassword((e) => !e)}
                        />
                      )}
                    </span>
                  </div>
                  {formik.status ? (
                    <p className="text-danger text-center">{formik.status}</p>
                  ) : null}
                  <p className="forgot-password-text text-center">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </p>
                  <div className="text-center login-btn">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      } ${formik.isValid ? "" : "opacity-75"}`}
                      disabled={formik.isSubmitting}
                      value="Login"
                    />
                  </div>
                  <p className="sign-up-text text-center">
                    Don't have an account ? <Link to="/signup">Signup</Link>
                  </p>
                </form>
              </div>
              <div className="login-other-option">
                <div className="login-other-text">
                  <span>OR</span>
                </div>
                <div className="login-signup-inner login-with-opt-wrap">
                  <Link
                    className="btn btn-primary blue-bg"
                    to="/login-with-mobile"
                  >
                    Login with Mobile
                  </Link>
                  {/* <p className="sign-up-text text-center">
                    Don't have an account ? <a href="/signup">Signup</a>
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        id="login_otp_modal"
        show={showVerifyPhonePopup}
        // setShow={setShowVerifyPhonePopup}
      >
        <VerifyLoginWithOtp
          setShow={setShowVerifyPhonePopup}
          {...{ emailOrMobile, countryCode, loginType }}
        />
      </Modal>
      <script src="js/bootstrap.bundle.min.js"></script>
      <script src="js/bootstrap.esm.min.js"></script>
    </div>
  );
};

export default LoginWithEmail;
