import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { LoginSchema } from "schemas/validationSchema";
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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  const [showPassword, setShowPassword] = useState(false);
  const [countryList, cities] = useCountriesCities();
  const { setLoginCreds } = useContext(LoginContext);

  useEffect(() => {
    const token = storageRequest.getAuth();
    if (token) navigate("/", { replace: true });
  }, []);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const formik = useFormik({
    initialValues: {
      country_code: "",
      user_name: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm, setErrors, setStatus }) => {
      setIsLoading(true);
      try {
        const { error, payload } = await dispatch(fetchLogin(values));
        if (error) throw payload;
        setLoginCreds((ls) => ({
          ...ls,
          renew_kyc_approved_status:
            payload.data.kyc_renew_data?.renew_kyc_approved_status || "",
          renew_kyc_attempt_count:
            payload.data.kyc_renew_data?.renew_kyc_attempt_count || "",
          show_renew_section:
            payload.data.kyc_renew_data?.show_renew_section || "",
          show_renew_button: Boolean(
            payload.data.kyc_renew_data?.show_renew_button
          ),
          kyc_message: payload.data.kyc_renew_data?.kyc_message || "",
        }));
        navigate("/", { replace: true });
      } catch (error) {
        if (typeof error === "string") setStatus(error);
        setErrors({
          user_name: error?.user_name?.[0],
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
                <h5 className="text-center">Login</h5>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row form-field">
                    <div className="col-4 ps-0">
                      <InputSelect
                        className="form-select form-control"
                        name="country_code"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.country_code}
                        error={
                          formik.touched.country_code &&
                          formik.errors.country_code
                        }
                      >
                        <option value={""}>Country</option>
                        {countryList?.map((country, index) => (
                          <option
                            value={country.phonecode}
                            key={country.phonecode || index}
                          >
                            {country.phonecode} &nbsp; {country.country_name}
                          </option>
                        ))}
                      </InputSelect>
                    </div>
                    <div className="col-8 px-0">
                      <Input
                        type="mobile"
                        inputMode="tel"
                        className="form-control"
                        placeholder="Mobile Number"
                        name="user_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.user_name}
                        error={
                          formik.touched.user_name && formik.errors.user_name
                        }
                      />
                    </div>
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
                    />
                    <span className="eye-icon" style={{ top: "12px", right: isSafari && isInputFocused ? "45px" : "" }}>
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
                    to="/login-with-otp"
                  >
                    Login with OTP
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
      <script src="js/bootstrap.bundle.min.js"></script>
      <script src="js/bootstrap.esm.min.js"></script>
    </div>
  );
};

export default Login;
