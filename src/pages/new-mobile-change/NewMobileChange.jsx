import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "shared/cookies";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { loginWithOtpSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import Modal from "components/modals/Modal";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import VerifyNewMobileOtp from "./components/VerifyNewMobileOtp";

const NewMobileChange = (props) => {
  const { setShow, details } = props;
  const { customer_id } = details || {};
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const [countryList] = useCountriesCities();

  useEffect(() => {
    const token = getCookie("auth._token.Bearer");
    if (token) navigate("/");
  }, [navigate]);

  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [showVerifyPhonePopup, setShowVerifyPhonePopup] = useState(false);

  const formik = useFormik({
    initialValues: {
      country_code: "",
      mobile_number: "",
      verify_number_flag: "new_number",
      verification_via: "sms",
      customer_id: customer_id,
    },
    validationSchema: loginWithOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      setIsLoading(true);      
      try {
        const { data } = await apiRequest.createChangeMobileOtp(values);        
        if (!data.success) throw data.message;
        setMobileNumber(values.mobile_number);
        setCountryCode(values.country_code);
        if (data?.data?.otp) toast.success(data.data.otp);
        toast.success(data.message);
        setShowVerifyPhonePopup(true);
      } catch (error) {
        resetForm();
        setStatus(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    // <div className="login-signup common-body-bg">
    <div className="container">
      <div className="row">
        {/* <div className="col-xs-12"> */}
        <div
          className="login-signup-content-wrap login-signup01-content-wrap"
          style={{ padding: "38px 50px 41px" }}
        >
          <div className="login-signup-inner">
            <h4 className="blue-text text-center">Enter New Mobile Number</h4>
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
                      formik.touched.country_code && formik.errors.country_code
                    }
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
                <div className="col-8 px-0">
                  <Input
                    type="mobile"
                    inputMode="tel"
                    className="form-control"
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
              <div className="text-center new-mobile-send-cd-btn">
                {formik.status ? (
                  <p className="text-danger">{formik.status}</p>
                ) : null}
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Verify Number"
                  disabled={formik.isSubmitting}
                />
              </div>
              <div className="pop-cancel-btn text-center">
                <button type="button" onClick={() => setShow(false)}>
                  Cancel
                </button>
              </div>
              <div>
                <p className="text-danger text-center">Note: You can change your mobile only 2 times in 6 months</p>
              </div>
            </form>
          </div>
        </div>
        {/* </div> */}
      </div>
      {/* </div> */}
      <Modal
        id="login_otp_modal"
        show={showVerifyPhonePopup}
        // setShow={setShowVerifyPhonePopup}
      >
        <VerifyNewMobileOtp
          setShow={setShowVerifyPhonePopup}
          {...{ mobileNumber, countryCode, customer_id }}
        />
      </Modal>
    </div>
  );
};

export default NewMobileChange;
