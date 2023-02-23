import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { signUpBusinessAccountSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { SignupContext } from "context/signupContext";
import Input from "components/ui/Input";
import InputFile from "components/ui/InputFile";
import InputSelect from "components/ui/InputSelect";

function Businessform(props) {
  const { signUpCreds, setSignUpCreds } = useContext(SignupContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { countryList, cityList } = signUpCreds || {};

  const formik = useFormik({
    initialValues: {
      company_name: "",
      user_type: signUpCreds.user_type || "business",
      email: "",
      password: "",
      confirm_password: "", //not required for API
      mobile_number: signUpCreds.mobile_number,
      profile_image: "",
      country_index: -1, //not required for API
      country: "",
      country_iso: "", //not required for API
      country_code: "",
      city: "",
    },
    validationSchema: signUpBusinessAccountSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      try {
        const formData = new FormData();
        for (let key in values) {
          if (key === "profile_image") continue;
          formData.append(key, values[key]);
        }
        formData.append("profile_image", values.profile_image);
        const { data } = await apiRequest.registerUser(formData);
        if (!data.success || data.data === null) throw data.message;
        setSignUpCreds({ step: 0 });
        toast.success(data.message);
        navigate("/login");
      } catch (error) {
        setErrors({
          email: error.email?.[0],
          mobile_number: error.mobile_number?.[0],
        });
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
                labelText="Change Profile Picture"
                fallbackSrc="/assets/images/profile-img.png"
                classNameInput="d-none"
              />
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">
                Please Enter Business Details
              </h4>
              <Input
                type="text"
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
                className="form-control"
                placeholder="Mobile Number"
                name="mobile_number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile_number}
                error={
                  formik.touched.mobile_number && formik.errors.mobile_number
                }
              />
              <InputSelect
                className="form-select form-control"
                name="country_index"
                onChange={({ currentTarget }) => {
                  const i = parseInt(currentTarget.value);
                  formik.setFieldValue("country_index", i);
                  formik.setFieldValue("country_iso", countryList[i].iso);
                  formik.setFieldValue(
                    "country_code",
                    countryList[i].phonecode
                  );
                  formik.setFieldValue("country", countryList[i].country_name);
                  formik.setFieldValue("city", "");
                }}
                onBlur={formik.handleBlur}
                value={formik.values.country_index}
                error={formik.touched.country && formik.errors.country}
              >
                <option value={""}>Select Country</option>
                {countryList?.map((country, index) => (
                  <option key={index} value={index}>
                    {country.country_name}
                  </option>
                ))}
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
                {cityList[formik.values.country_iso]?.map((city, index) => (
                  <option key={index} value={city.city_name}>
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
              <div className="form-field">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="form-control w-100 position-relative"
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={formik.touched.password && formik.errors.password}
                  autoComplete={"new-password"}
                />
                <span className="eye-icon" style={{ top: "24px" }}>
                  <img
                    className="eye-close"
                    src="/assets/images/eye-close.png"
                    alt="eye close icon"
                    onClick={() => setShowPassword((e) => !e)}
                  />
                </span>
              </div>
              <div className="form-field">
                <Input
                  type="password"
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
                />
                {formik.touched.confirm_password &&
                  !formik.errors.confirm_password && (
                    <span className="eye-icon" style={{ top: "24px" }}>
                      <img
                        className="eye-close"
                        src="/assets/images/green-tick.svg"
                        alt="eye close icon"
                      />
                    </span>
                  )}
              </div>
              <div className="text-center sign-up-btn">
                <input
                  type="submit"
                  className={`btn btn-primary ${
                    formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                  }`}
                  disabled={formik.isSubmitting}
                  value="Signup"
                />
              </div>
              <p className="sign-up-text text-center">
                Already have an account? <a href="/login">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Businessform;
