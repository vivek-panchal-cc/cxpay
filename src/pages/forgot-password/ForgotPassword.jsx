import { useFormik } from "formik";
import React, { useState } from "react";
import Input from "components/ui/Input";
import Modal from "components/modals/Modal";
import VerifyOtp from "./components/VerifyOtp";
import { apiRequest } from "helpers/apiRequests";
import { forgotPasswordSchema } from "schemas/validationSchema";
import { toast } from "react-toastify";
import useCountriesCities from "hooks/useCountriesCities";
import InputSelect from "components/ui/InputSelect";
import { CXPAY_LOGO } from "constants/all";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [countryList] = useCountriesCities();

  const formik = useFormik({
    initialValues: {
      country_code: "",
      mobile_number: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.generateForgotPasswordOtpChange(
          values
        );
        if (!data.success) throw data.message;
        if (data?.data?.login_otp) toast.success(data.data.login_otp);
        toast.success(data.message);
        setShowOtpPopup(true);
      } catch (error) {
        resetForm();
        setStatus(error);
        console.log(error);
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
                <h5 className="text-center">Forgot Password</h5>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
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
                        {countryList?.map((country) => (
                          <option
                            value={country.phonecode}
                            key={country.phonecode}
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
                        className="form-control w-100"
                        placeholder="Registered Mobile Number"
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
                  {formik.status ? (
                    <p className="text-danger text-center">{formik.status}</p>
                  ) : null}
                  <div className="text-center login-btn">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      }`}
                      disabled={formik.isSubmitting}
                      value="Send Code"
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
      <Modal
        id="forgot-password-popup"
        show={showOtpPopup}
        // setShow={setShowOtpPopup}
      >
        <VerifyOtp setShow={setShowOtpPopup} values={formik.values} />
      </Modal>
    </div>
  );
}

export default ForgotPassword;
