import React, { useEffect, useContext, useState } from "react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import InputSelect from "components/ui/InputSelect";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { IconLeftArrow } from "styles/svgs";
import { businessInfoSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { LoaderContext } from "context/loaderContext";
import { LoginContext } from "context/loginContext";
import { isComponentDisabled } from "constants/all";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";

const BusinessForm = (props) => {
  const { countryList, profile } = props;
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [error, setError] = useState("");
  const { handleForgotPin, OtpModal, PinModal } =
    useForgotPinHandler(setShowPinPopup);
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const disableComponent = isComponentDisabled(
    !profile.admin_approved,
    show_renew_section
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);

  const formik = useFormik({
    initialValues: {
      business_url: profile?.business_url,
      business_id: "",
      business_country: "",
    },
    validationSchema: businessInfoSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      setError("");
      setShowPinPopup(true);
    },
  });

  const handleSubmitData = async (pin) => {
    if (!pin) return;
    setIsLoading(true);
    try {
      const params = {
        ...formik.values,
        user_pin: pin,
      };
      const { data } = await apiRequest.updateBusinessData(params);
      if (data.success) {
        setShowPinPopup(false);
        dispatch(fetchUserProfile());
        toast.success("Business data updated successfully.");
        navigate("/setting");
      }
      if (!data.success) throw data;
    } catch (error) {
      if (typeof error.message === "string") setError(error.message);
      if (error.data?.is_suspended) {
        navigate("/logout", { replace: true });
        toast.error(error.message);
      }
      if (typeof error.message === "object" && error.message !== null) {
        formik.setErrors({
          business_url: error?.message?.business_url?.[0],
          business_id: error?.message?.business_id?.[0],
          business_country: error?.message?.business_country?.[0],
        });
        setShowPinPopup(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    formik.setFieldValue("business_url", profile?.business_url ?? "");
    formik.setFieldValue("business_id", profile?.business_id ?? "");
    formik.setFieldValue("business_country", profile?.business_country ?? "");
  }, [profile]);

  return (
    <>
      <ModalPaymentPin
        id="group_pay_otp_modal"
        className="otp-verification-modal group_pay_otp_modal"
        show={showPinPopup}
        allowClickOutSide={true}
        setShow={setShowPinPopup}
        heading="Enter your 5 - Digit unique PIN"
        headingImg="/assets/images/setupPin.svg"
        subHeading=""
        validationSchema={sendPaymentPinSchema}
        error={error}
        handleSubmitPin={handleSubmitData}
        handleForgotPin={handleForgotPin}
      />
      {OtpModal()}
      {PinModal()}
      <form onSubmit={formik.handleSubmit}>
        <div className="form-field business-url-field">
          <p>Business URL</p>
          <Input
            type="text"
            className="form-control"
            id="business-url"
            name="business_url"
            placeholder="Business URL"
            value={formik.values.business_url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.business_url && formik.errors.business_url}
          />
        </div>
        <div className="form-field business-id-field">
          <p>
            Chamber of Commerce{" "}
            <span className="smaller-note">(not older than 2 months)</span>
          </p>
          <Input
            type="text"
            className={`form-control ${
              disableComponent ? "disabled-field" : ""
            }`}
            id="business-id"
            name={disableComponent ? "" : "business_id"}
            placeholder="Chamber of Commerce"
            value={formik.values.business_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.business_id && formik.errors.business_id}
            disabled={disableComponent}
          />
        </div>
        <div className="form-field">
          <InputSelect
            className={`form-select form-control ${
              profile?.business_country ? "disabled-field" : ""
            }`}
            name={profile?.business_country ? "" : "business_country"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.business_country}
            error={
              formik.touched.business_country && formik.errors.business_country
            }
            disabled={profile?.business_country}
          >
            <option value={""}>Select Country</option>
            {countryList?.map((country) => (
              <option key={country.iso} value={country.iso}>
                {country.country_name}
              </option>
            ))}
          </InputSelect>
        </div>
        <div className="login-btn">
          <div className="setting-btn-link">
            <Link to="/setting">
              <IconLeftArrow style={{ stroke: "#0081C5" }} />
              Settings
            </Link>
          </div>
          <Button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </>
  );
};

export default BusinessForm;
