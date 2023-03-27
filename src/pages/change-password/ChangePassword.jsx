import React, { useContext, useState } from "react";
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

  return (
    <div className="settings-password-right-sec">
      <div className="settings-note-inner-sec">
        <div className="profile-info">
          <h3>Change Password</h3>
          <Breadcrumb />
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
                    onBlur={formik.handleBlur}
                    value={formik.values.current_password}
                    error={
                      formik.touched.current_password &&
                      formik.errors.current_password
                    }
                    autoComplete={"new-password"}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  <span className="eye-icon" style={{ top: "24px" }}>
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
                    onBlur={formik.handleBlur}
                    value={formik.values.new_password}
                    error={
                      formik.touched.new_password && formik.errors.new_password
                    }
                    autoComplete={"new-password"}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  <span className="eye-icon" style={{ top: "24px" }}>
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
                </div>
                <div className="form-field">
                  <Input
                    type={showPassword.confirm ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm Password"
                    name="confirm_password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirm_password}
                    error={
                      formik.touched.confirm_password &&
                      formik.errors.confirm_password
                    }
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  {formik.touched.confirm_password &&
                    !formik.errors.confirm_password && (
                      <span
                        className="eye-icon"
                        style={{ top: "24px", right: "45px" }}
                      >
                        <img
                          className="eye-close"
                          src="/assets/images/green-tick.svg"
                          alt="eye close icon"
                        />
                      </span>
                    )}
                  <span className="eye-icon" style={{ top: "24px" }}>
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
