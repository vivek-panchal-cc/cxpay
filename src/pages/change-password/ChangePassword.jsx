import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { passwordChangeSchema } from "../../schemas/settingSchema";
import { apiRequest } from "../../helpers/apiRequests";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IconEyeClose, IconEyeOpen, IconLeftArrow } from "styles/svgs";
import { LoaderContext } from "context/loaderContext";
import { Link, useNavigate } from "react-router-dom";

function ChangePassword() {
  const { setIsLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state?.userProfile);
  const { email } = profile || {};
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordStrengthData, setPasswordStrengthData] = useState({
    strength: "",
    percent: 0,
  });

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const [isInputOldPasswordFocused, setIsInputOldPasswordFocused] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputConfirmedFocused, setIsInputConfirmedFocused] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: email || "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: passwordChangeSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.passwordChange(values);
        if (!data.success) throw data.message;
        resetForm();
        toast.success(data.message);
        navigate("/logout", { replace: true });
      } catch (error) {
        toast.error(error);
        resetForm();
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    setPasswordStrengthData(checkPasswordStrength(formik.values.new_password));
  }, [formik.values.new_password]);

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(formik.values.new_password));
  }, [formik.values.new_password]);

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

  return (
    <div className="settings-password-right-sec settings-vc-sec">
      <div className="settings-note-inner-sec">
        <div className="profile-info">
          <h3>Change Password</h3>
          {/* <Breadcrumb /> */}
          <ul className="breadcrumb">
            <li>
              <Link to="/setting">Setting</Link>
            </li>
            <li>Change Password</li>
          </ul>
        </div>
        <div className="settings-profile-bottom-info-sec settings-password-bottom-info-sec">
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="change-tab"
            >
              <form onSubmit={formik.handleSubmit}>
                <div className="form-field">
                  <Input
                    type={showPassword.old ? "text" : "password"}
                    className="form-control"
                    placeholder="Old Password"
                    name="current_password"
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e); // Pass the event to formik.handleBlur
                      setIsInputOldPasswordFocused(false);
                    }}
                    value={formik.values.current_password}
                    error={
                      formik.touched.current_password &&
                      formik.errors.current_password
                    }
                    autoComplete={"new-password"}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onFocus={() => setIsInputOldPasswordFocused(true)}
                  />
                  <span className="eye-icon" style={{ top: "24px", right: isSafari && isInputOldPasswordFocused ? "45px" : "" }}>
                    {showPassword.old ? (
                      <IconEyeOpen
                        onClick={() =>
                          setShowPassword((e) => ({ ...e, old: !e.old }))
                        }
                      />
                    ) : (
                      <IconEyeClose
                        onClick={() =>
                          setShowPassword((e) => ({ ...e, old: !e.old }))
                        }
                      />
                    )}
                  </span>
                </div>
                <div className="form-field">
                  <Input
                    type={showPassword.new ? "text" : "password"}
                    className="form-control"
                    placeholder="New Password"
                    name="new_password"
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e); // Pass the event to formik.handleBlur
                      setIsInputFocused(false);
                    }}
                    value={formik.values.new_password}
                    error={
                      formik.touched.new_password && formik.errors.new_password
                    }
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
                  {formik.values.new_password && (
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
                          style={{ width: `${passwordStrengthData.percent}%` }}
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
                <div className="login-btn">
                  <div className="setting-btn-link">
                    <Link to="/setting" replace={true}>
                      <IconLeftArrow style={{ stroke: "#0081C5" }} />
                      Settings
                    </Link>
                  </div>
                  <input
                    type="submit"
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    }`}
                    disabled={formik.isSubmitting}
                    value="Change"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
