import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { enterPhoneSchema } from "schemas/validationSchema";
import AlreadyRegistered from "./AlreadyRegistered";
import VerifyPhone from "./VerifyPhone";
import Modal from "components/modals/Modal";
import { SignupContext } from "context/signupContext";
import InputSelect from "components/ui/InputSelect";
import { toast } from "react-toastify";

function EnterPhone(props) {
  const { signUpCreds, setSignUpCreds, getCountries } =
    useContext(SignupContext);
  const [showRegisteredPopup, setShowregisteredPopup] = useState(false);
  const [showVerifyPhonePopup, setShowVerifyPhonePopup] = useState(false);
  // const [username, setUsername] = useState("USERNAME");
  const { countryList } = signUpCreds || {};
  const phoneCodes = countryList.map((item) => item.phonecode);

  useEffect(() => {
    getCountries();
  }, []);

  const formik = useFormik({
    initialValues: {
      mobile_number: "",
      country_code: "",
    },
    validationSchema: enterPhoneSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      try {
        const { data } = await apiRequest.verifyMobileNumber(values);
        if (!data.success || data.data === null) throw data.message;
        if (data.data.isAlreadyRegster === "1") {
          // setUsername(data.data?.user_name);
          return setShowregisteredPopup(true);
        }
        setSignUpCreds((cs) => ({
          ...cs,
          mobile_number: values.mobile_number,
          mobile_code: values.country_code,
        }));
        setShowVerifyPhonePopup(true);
        toast.success(data.data.otp);
        toast.success(data.message);
      } catch (error) {
        setErrors({
          country_code: error.country_code?.[0],
          mobile_number: error.mobile_number?.[0],
        });
      }
    },
  });

  return (
    <div className="container login-signup-01">
      <div className="row">
        <div className="col-xs-12">
          <div className="login-signup-content-wrap login-signup01-content-wrap">
            <div className="login-signup-inner">
              <Modal id="login_otp_modal" show={showVerifyPhonePopup}>
                <VerifyPhone {...{ signUpCreds, setSignUpCreds }} />
              </Modal>
              <Modal id="already_register_user" show={showRegisteredPopup}>
                {/* <AlreadyRegistered username={username} /> */}
                <AlreadyRegistered />
              </Modal>
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="/">
                  <img src="/assets/images/logo-1.png" alt="login logo img" />
                </a>
              </div>
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">
                Please Enter Mobile Number
              </h4>
              <form onSubmit={formik.handleSubmit}>
                <div className="row form-field">
                  <div className="col-4">
                    <InputSelect
                      className="form-select form-control"
                      name="country_code"
                      onBlur={formik.handleBlur}
                      value={formik.values.country_code}
                      error={
                        formik.touched.country_code &&
                        formik.errors.country_code
                      }
                      onChange={formik.handleChange}
                    >
                      <option value={""}>Code</option>
                      {countryList?.map((country, index) => (
                        <option value={country.phonecode} key={index}>
                          {country.phonecode} &nbsp; {country.country_name}
                        </option>
                      ))}
                    </InputSelect>
                  </div>
                  <div className="col-8 px-0">
                    <Input
                      type="mobile"
                      className="form-control"
                      placeholder="Mobile Number"
                      name="mobile_number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile_number}
                      error={
                        formik.touched.mobile_number &&
                        formik.errors.mobile_number
                      }
                    />
                  </div>
                </div>
                <div className="text-center send-cd-btn">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Send Code"
                    disabled={formik.isSubmitting}
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
    </div>
  );
}

export default EnterPhone;
