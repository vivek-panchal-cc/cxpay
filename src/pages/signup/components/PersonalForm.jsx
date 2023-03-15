import React, { useContext, useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { signUpPersonalAccountSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SignupContext } from "context/signupContext";
import InputFile from "components/ui/InputImage";
import InputSelect from "components/ui/InputSelect";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { LoaderContext } from "context/loaderContext";
import { storageRequest } from "helpers/storageRequests";

function PersonalForm(props) {
  const { setIsLoading } = useContext(LoaderContext);
  const { signUpCreds, setSignUpCreds } = useContext(SignupContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const { countryList, cityList } = signUpCreds || {};

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      user_type: signUpCreds.user_type || "personal",
      mobile_number: signUpCreds.mobile_number,
      personal_id: "",
      email: "",
      password: "",
      confirm_password: "", //not required for API
      profile_image: "",
      country_index: -1, //not required for API
      country: "",
      country_iso: "", //not required for API
      mobile_code: signUpCreds.mobile_code,
      city: "",
    },
    validationSchema: signUpPersonalAccountSchema,
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
        setSignUpCreds({ step: 0 });
        toast.success(data.message);
        storageRequest.setAuth(data.data.token);
        navigate("/");
      } catch (error) {
        setErrors({
          email: error.email?.[0],
          mobile_number: error.mobile_number?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

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
                fallbackSrc="/assets/images/Personal.png"
                classNameInput="d-none"
              />
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">
                Please Enter Your Details
              </h4>
              <div className="row">
                <div className="col-lg-6 col-12 col-left p-0">
                  <Input
                    type="name"
                    className="form-control"
                    placeholder="First Name"
                    name="first_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                    error={
                      formik.touched.first_name && formik.errors.first_name
                    }
                  />
                </div>
                <div className="col-lg-6 col-12 col-right p-0">
                  <Input
                    type="name"
                    className="form-control"
                    placeholder="Last Name"
                    name="last_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                    error={formik.touched.last_name && formik.errors.last_name}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-12 col-left col p-0">
                  <InputSelect
                    className="form-select form-control"
                    name="country_index"
                    onChange={({ currentTarget }) => {
                      const i = parseInt(currentTarget.value);
                      formik.setFieldValue("country_index", i);
                      formik.setFieldValue("country_iso", countryList[i]?.iso);
                      formik.setFieldValue(
                        "country",
                        countryList[i]?.country_name
                      );
                      formik.setFieldValue("city", ""); // imp
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.country_index}
                    error={
                      formik.touched.country_index && formik.errors.country
                    }
                  >
                    <option value={"-1"}>Select Country</option>
                    {countryList?.map((country, index) => (
                      <option key={index} value={index}>
                        {country.country_name}
                      </option>
                    ))}
                  </InputSelect>
                </div>
                <div className="col-lg-6 col-12 col-right col p-0">
                  <InputSelect
                    className="form-select form-control"
                    name="city"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.city}
                    error={formik.touched.city && formik.errors.city}
                  >
                    <option value={""}>Select City</option>
                    {cityList[formik.values.country_iso]?.map((city, index) => (
                      <option key={index} value={city.city_name}>
                        {city.city_name}
                      </option>
                    ))}
                  </InputSelect>
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Personal ID"
                    name="personal_id"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.personal_id}
                    error={
                      formik.touched.personal_id && formik.errors.personal_id
                    }
                    autoComplete={"new-id"}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0">
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
              </div>
              <div className="row">
                <div className="col-12 col p-0">
                  <div className="form-field">
                    <Input
                      type={showPassword.new ? "text" : "password"}
                      className="form-control w-100"
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
                  </div>
                </div>
                <div className="col-12 col p-0">
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
                </div>
              </div>
              <div className="text-center login-btn personal-sign-up">
                <input
                  type="submit"
                  className={`btn btn-primary ${
                    formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                  } ${formik.isValid ? "" : "opacity-75"}`}
                  disabled={formik.isSubmitting}
                  value="Signup"
                />
              </div>
            </form>
            <p className="sign-up-text text-center">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalForm;
