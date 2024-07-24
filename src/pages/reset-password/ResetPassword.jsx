import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordSchema } from "schemas/validationSchema";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { LoaderContext } from "context/loaderContext";
import { CXPAY_LOGO } from "constants/all";

function ResetPassword() {
  const { setIsLoading } = useContext(LoaderContext);
  const params = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordStrengthData, setPasswordStrengthData] = useState({
    strength: "",
    percent: 0,
  });

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputConfirmedFocused, setIsInputConfirmedFocused] = useState(false);

  const formik = useFormik({
    initialValues: {
      country_code: params.code,
      mobile_number: params.mobile,
      token: params.token,
      password: "",
      confirm_password: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.updateForgotPassword(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        navigate("/login");
      } catch (error) {
        resetForm();
        setStatus(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    setPasswordStrengthData(checkPasswordStrength(formik.values.password));
  }, [formik.values.password]);

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(formik.values.password));
  }, [formik.values.password]);

  const checkPasswordStrength = (password) => {
    const regexWeak = /^(?=.*[a-zA-Z])/;
    const regexMedium = /^(?=.*[0-9])(?=.*[a-zA-Z])/;
    const regexStrong = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/;
    const regexVeryStrong =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#])/;

    if (regexVeryStrong.test(password) && password.length >= 12) {
      return { strength: "secure", percent: 100 };
    } else if (regexStrong.test(password) && password.length >= 10) {
      return { strength: "strong", percent: 75 };
    } else if (regexMedium.test(password) && password.length >= 8) {
      return { strength: "medium", percent: 50 };
    } else if (regexWeak.test(password)) {
      return { strength: "weak", percent: 25 };
    } else {
      return { strength: "very weak", percent: 0 };
    }
  };

  if (!params.token) navigate("/");
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
                <h5 className="text-center">Reset Password</h5>
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-field">
                    <Input
                      type={showPassword.new ? "text" : "password"}
                      className="form-control"
                      placeholder="New Password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={(e) => {
                        formik.handleBlur(e); // Pass the event to formik.handleBlur
                        setIsInputFocused(false);
                      }}
                      value={formik.values.password}
                      error={formik.touched.password && formik.errors.password}
                      autoComplete={"new-password"}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onFocus={() => setIsInputFocused(true)}
                    />
                    <span className="eye-icon" style={{ top: "24px", right: isSafari && isInputFocused ? "45px" : "" }}>
                      {showPassword.new ? (
                        <IconEyeOpen
                          onClick={() =>
                            setShowPassword((e) => ({ ...e, new: !e.new }))
                          }
                        />
                      ) : (
                        <IconEyeClose
                          onClick={() =>
                            setShowPassword((e) => ({ ...e, new: !e.new }))
                          }
                        />
                      )}
                    </span>
                    {formik.values.password && (
                      <div className="password-strength-container">
                        <div
                          className="password-strength-bar"
                          style={{
                            width:
                              passwordStrengthData.strength === "very weak"
                                ? "100%"
                                : "80%",
                          }}
                        >
                          <div
                            className={`strength-indicator ${passwordStrengthData.strength}`}
                            style={{
                              width: `${passwordStrengthData.percent}%`,
                            }}
                          ></div>
                        </div>
                        {passwordStrengthData.strength !== "very weak" && (
                          <span
                            className={`strength-label ${passwordStrengthData.strength}`}
                          >
                            {passwordStrengthData.strength
                              .charAt(0)
                              .toUpperCase() +
                              passwordStrengthData.strength.slice(1)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="form-field">
                    <Input
                      type={showPassword.confirm ? "text" : "password"}
                      className="form-control"
                      placeholder="Confirm Password"
                      name="confirm_password"
                      onChange={formik.handleChange}
                      onBlur={(e) => {
                        formik.handleBlur(e); // Pass the event to formik.handleBlur
                        setIsInputConfirmedFocused(false);
                      }}
                      value={formik.values.confirm_password}
                      error={
                        formik.touched.confirm_password &&
                        formik.errors.confirm_password
                      }
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onFocus={() => setIsInputConfirmedFocused(true)}
                    />
                    {formik.touched.confirm_password &&
                    !formik.errors.confirm_password ? (
                      <span
                        className="eye-icon"
                        style={{ top: "24px", right: isSafari && isInputConfirmedFocused ? "70px" : "45px" }}
                      >
                        <img
                          className="eye-close"
                          src="/assets/images/green-tick.svg"
                          alt="eye close icon"
                        />
                      </span>
                    ) : null}
                    <span className="eye-icon" style={{ top: "24px", right: isSafari && isInputConfirmedFocused ? "45px" : "" }}>
                      {showPassword.confirm ? (
                        <IconEyeOpen
                          onClick={() =>
                            setShowPassword((e) => ({
                              ...e,
                              confirm: !e.confirm,
                            }))
                          }
                        />
                      ) : (
                        <IconEyeClose
                          onClick={() =>
                            setShowPassword((e) => ({
                              ...e,
                              confirm: !e.confirm,
                            }))
                          }
                        />
                      )}
                    </span>
                  </div>
                  {formik.status ? (
                    <p className="text-danger">{formik.status}</p>
                  ) : null}
                  <div className="text-center login-btn">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      }`}
                      disabled={formik.isSubmitting}
                      value="Change Password"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
