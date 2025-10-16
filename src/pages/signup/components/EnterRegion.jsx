import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { enterPhoneRegionSchema } from "schemas/validationSchema";
import { SignupContext } from "context/signupContext";
import InputSelect from "components/ui/InputSelect";
import { CXPAY_LOGO } from "constants/all";
import { Link } from "react-router-dom";
import { TimeZoneContext } from "context/timeZoneContext";

function EnterRegion(props) {
  const { signUpCreds, setSignUpCreds } = useContext(SignupContext);
  const [showRegisteredPopup, setShowregisteredPopup] = useState(false);
  const [showVerifyPhonePopup, setShowVerifyPhonePopup] = useState(false);
  const { countryList, email, token } = signUpCreds || {};
  const { setCountryTimeZone } = useContext(TimeZoneContext);

  const handleChangeCountry = (e) => {
    formik.setFieldValue("country_code", e.target.value);
    const selectedCountry = countryList?.find(
      (c) => String(c.phonecode) === String(e.target.value)
    );

    if (selectedCountry) {
      setSignUpCreds((cs) => ({
        ...cs,
        country_code: selectedCountry.phonecode,
        selected_country_name: selectedCountry.country_name,
        country_iso: selectedCountry.iso,
      }));
    } else {
      setSignUpCreds((cs) => ({
        ...cs,
        country_code: "",
        selected_country_name: "",
        country_iso: "",
      }));
    }
  };

  const formik = useFormik({
    initialValues: {
      country_code: "",
    },
    validationSchema: enterPhoneRegionSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      // Get the selected country's time zone
      const selectedCountry = countryList.find(
        (country) => country.phonecode.toString() === values.country_code
      );
      const country_time_zone = selectedCountry
        ? selectedCountry.time_zone
        : "";
      setCountryTimeZone({ country_time_zone });
      try {
        setSignUpCreds((cs) => ({
          ...cs,
          step: 1,
          country_code: values.country_code,
        }));
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="container login-signup-01">
      <div className="row">
        <div className="col-xs-12">
          <div className="login-signup-content-wrap login-signup01-content-wrap">
            <div className="login-signup-inner">
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="/">
                  <img src={CXPAY_LOGO} alt="login logo img" />
                </a>
              </div>
              <h5 className="text-center">Signup</h5>
              <form onSubmit={formik.handleSubmit}>
                <div className="row form-field">
                  <div className="">
                    <InputSelect
                      className="form-select form-control"
                      name="country_code"
                      onBlur={formik.handleBlur}
                      value={formik.values.country_code}
                      error={
                        formik.touched.country_code &&
                        formik.errors.country_code
                      }
                      // onChange={formik.handleChange}
                      onChange={handleChangeCountry}
                    >
                      <option value={""}>Country</option>
                      {countryList?.map((country, index) => (
                        <option
                          value={country.phonecode}
                          key={country?.phonecode || index}
                        >
                          {country.phonecode} &nbsp; {country.country_name}
                        </option>
                      ))}
                    </InputSelect>
                  </div>
                </div>
                <div className="text-center send-cd-btn">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Submit"
                    disabled={formik.isSubmitting}
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
    </div>
  );
}

export default EnterRegion;
