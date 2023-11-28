import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { signUpBusinessAccountSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { SignupContext } from "context/signupContext";
import Input from "components/ui/Input";
import InputFile from "components/ui/InputImage";
import InputSelect from "components/ui/InputSelect";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { LoaderContext } from "context/loaderContext";
import { storageRequest } from "helpers/storageRequests";
import { Link } from "react-router-dom";

function Businessform(props) {
  const { setIsLoading } = useContext(LoaderContext);
  const { signUpCreds, setSignUpCreds } = useContext(SignupContext);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const { countryList, cityList, country_iso, selected_country_name } =
    signUpCreds || {};

  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordStrengthData, setPasswordStrengthData] = useState({
    strength: "",
    percent: 0,
  });

  const formik = useFormik({
    initialValues: {
      company_name: "",
      user_type: signUpCreds.user_type || "business",
      mobile_number: signUpCreds.mobile_number,
      country_code: signUpCreds.country_code,
      email: "",
      address: "",
      password: "",
      confirm_password: "", //not required for API
      country: country_iso || "",
      city: "",
      profile_image: "",
      terms_conditions: false,
    },
    validationSchema: signUpBusinessAccountSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        for (let key in values) {
          if (key === "profile_image") continue;
          formData.append(key, values[key]);
        }
        formData.append("profile_image", values.profile_image);
        const { data } = await apiRequest.registerUser(formData);
        if (!data.success) throw data.message;
        toast.success(data.message);
        storageRequest.setAuth(data.data.token);
        setSignUpCreds((cs) => ({ ...cs, step: 3 }));
      } catch (error) {
        setErrors({
          email: error?.email?.[0],
          mobile_number: error?.mobile_number?.[0],
        });
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

  // For making input scroll into view on validation error
  useEffect(() => {
    const { errors } = formik;
    if (!errors || Object.keys(errors).length <= 0) return;
    const inputName = Object.keys(errors)[0];
    const inputField = document.querySelector(`input[name='${inputName}']`);
    if (!inputField) return;
    inputField.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formik.isSubmitting]);

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

  const openCMSPages = async (slug) => {
    try {
      const { request } = await apiRequest.getCMSPage(slug);
      window.open(request.responseURL, "_blank");
    } catch (error) {
      console.error("Error fetching terms and conditions:", error);
    }
  };

  return (
    <div className="container login-signup-01 login-signup-02">
      <div className="row">
        <div className="col-xs-12">
          <div className="login-signup-content-wrap login-signup01-content-wrap">
            <form onSubmit={formik.handleSubmit}>
              <InputFile
                name="profile_image"
                onChange={(e) => {
                  formik.setFieldValue(
                    "profile_image",
                    e.currentTarget.files[0]
                  );
                }}
                error={formik.errors.profile_image}
                showPreview={true}
                showLabel={true}
                showLoader={true}
                labelText={
                  formik.values.profile_image
                    ? "Change Profile Picture"
                    : "Select Profile Picture"
                }
                fallbackSrc="/assets/images/Business-account.png"
                classNameInput="d-none"
              />
              {/* {!formik.values.profile_image ? ( */}
              <p className="red text-center">
                Note: Allowed formats are JPEG, PNG, JPG
              </p>
              {/* ) : null} */}
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">
                Please Enter Business Details
              </h4>
              <Input
                type="name"
                className="form-control"
                placeholder="Company Name"
                name="company_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.company_name}
                error={
                  formik.touched.company_name && formik.errors.company_name
                }
              />
              <Input
                type="text"
                inputMode="tel"
                className="form-control"
                placeholder="Mobile Number"
                name="mobile_number"
                disabled
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile_number}
                error={
                  formik.touched.mobile_number && formik.errors.mobile_number
                }
              />
              <InputSelect
                className="form-select form-control"
                name="country"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.country}
                disabled
                // error={formik.touched.country && formik.errors.country}
              >
                <option key={country_iso} value={country_iso}>
                  {selected_country_name || "Select Country"}
                </option>
              </InputSelect>
              <InputSelect
                className="form-select form-control"
                name="city"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
                error={formik.touched.city && formik.errors.city}
              >
                <option value={""}>Select City</option>
                {cityList[country_iso]?.map((city, index) => (
                  <option key={city?.city_name || index} value={city.city_name}>
                    {city.city_name}
                  </option>
                ))}
              </InputSelect>
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
              <Input
                type="text"
                className="form-control"
                placeholder="Address"
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                error={formik.touched.address && formik.errors.address}
              />
              <div className="form-field">
                <Input
                  type={showPassword.new ? "text" : "password"}
                  className="form-control w-100 position-relative"
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={formik.touched.password && formik.errors.password}
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
                        style={{ width: `${passwordStrengthData.percent}%` }}
                      ></div>
                    </div>
                    {passwordStrengthData.strength !== "very weak" && (
                      <span
                        className={`strength-label ${passwordStrengthData.strength}`}
                      >
                        {passwordStrengthData.strength.charAt(0).toUpperCase() +
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
                  placeholder="Confirm password"
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
                !formik.errors.confirm_password ? (
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
                ) : null}
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
              <div className="form-field terms-conditions">
                <input
                  type="checkbox"
                  id="terms_conditions"
                  name="terms_conditions"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.terms_conditions}
                />
                <label htmlFor="terms_conditions">
                  I have read and accept the{" "}
                  <span
                    className="hyperlink"
                    onClick={() =>
                      openCMSPages("terms-and-conditions")
                    }
                  >
                    terms and conditions
                  </span>
                  {formik.touched.terms_conditions &&
                    formik.errors.terms_conditions && (
                      <span
                        className="danger"
                        style={{
                          marginLeft: "8px",
                          color: "#dc3545",
                        }}
                      >
                        {formik.errors.terms_conditions}
                      </span>
                    )}
                </label>
              </div>
              <div className="text-center sign-up-btn">
                <input
                  type="submit"
                  className={`btn btn-primary ${
                    formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                  } ${formik.isValid ? "" : "opacity-75"}`}
                  disabled={formik.isSubmitting}
                  value="Signup"
                />
              </div>
              <p className="sign-up-text text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Businessform;
