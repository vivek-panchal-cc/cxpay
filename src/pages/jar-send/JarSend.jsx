import React, { useContext, useEffect, useRef, useState } from "react";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ModalAlert from "components/modals/ModalAlert";
import { isAdminApprovedWithRenewCheck } from "constants/all";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { LoginContext } from "context/loginContext";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import JarPaymentItem from "components/items/JarpaymentItem";
import { jarCreateSchema } from "schemas/jarSchema";
import { useFormik } from "formik";
import { IconScheduledDate } from "styles/svgs";

function JarSend(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const scheduleDate = location?.state?.scheduleDate;
  const inputAmountRefs = useRef([]);
  const { setIsLoading } = useContext(LoaderContext);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const { handleForgotPin, OtpModal, PinModal } =
    useForgotPinHandler(setShowPinPopup);

  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
  const [error, setError] = useState("");
  const [scrollTop, setScrollTop] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showSentPopup, setShowSentPopup] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showScheduleConfirmPopup, setShowScheduleConfirmPopup] =
    useState(false);
  const [scheduleCreds, setScheduleCreds] = useState(null);
  const [sentDetail, setSentDetail] = useState({
    heading: "",
    message: "",
    url: "",
  });
  const [scheduledData, setScheduledData] = useState(null);
  const { sendCreds, prevPathRedirect, cancelOwnJarPayment } =
    useContext(SavingJarOwnContext);
  const { wallet } = sendCreds || [];

  function convertDateFormat(inputDateStr) {
    // Convert the string to an ISO-like format
    const isoFormatStr = inputDateStr.replace(" ", "T");

    // Convert ISO-like string to a Date object
    const dateObj = new Date(isoFormatStr);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    // Extract day, month, year, hour, minute, and second
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
    const year = dateObj.getFullYear();

    let hour = dateObj.getHours();
    const minute = String(dateObj.getMinutes()).padStart(2, "0");
    const second = String(dateObj.getSeconds()).padStart(2, "0");

    // Convert 24-hour format to 12-hour format
    const isPM = hour >= 12;
    hour = isPM ? (hour === 12 ? hour : hour - 12) : hour === 0 ? 12 : hour; // Adjust for 12-hour format
    const period = isPM ? "PM" : "AM";

    // Return formatted string
    return `${day}/${month}/${year} ${hour}:${minute}:${second} ${period}`;
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: sendCreds,
    validationSchema: jarCreateSchema,
    onSubmit: async (values, { setValues, setErrors }) => {
      setError("");
      setShowPinPopup(true);
    },
  });

  const handleSubmitData = async (pin) => {
    if (!pin) return;
    setIsLoading(true);
    try {
      if (showSentPopup) return;
      const valuesWithPin = { ...formik.values.wallet, user_pin: pin };
      const muValues = { ...valuesWithPin };
      if (muValues.jar_url) delete muValues.jar_url;
      const { data } = await apiRequest.createTransactionJar(muValues);
      if (!data.success) throw data;
      // toast.success(`${data.message}`);
      setSentDetail({
        heading: "Money Sent",
        message: data.message,
        url: "/assets/images/sent-payment-pop.svg",
      });
      setShowSentPopup(true);
      setShowPinPopup(false);
    } catch (error) {
      setError(error.message);
      if (error.data.is_suspended) {
        navigate("/logout", { replace: true });
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = (ditem) => {
    if (!formik.values) return;
    const { wallet } = formik.values;
    const filteredContacts = wallet?.filter((item) => {
      if (ditem.email) {
        if (
          ditem.mobile &&
          ditem.email !== item.email &&
          ditem.mobile !== item.mobile
        ) {
          return true;
        } else if (ditem.email !== item.email) {
          return true;
        }
      }
    });
    handleSendCreds(filteredContacts);
  };

  const handleScheduleSubmit = async (scheduleDetails) => {
    if (!scheduleDetails) return;
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      setShowSchedulePopup(false);
      return;
    }
    setShowSchedulePopup(false);
    setScheduleCreds(scheduleDetails);
    setShowScheduleConfirmPopup(true);
  };

  // For post the schedule payment
  const handleConfirmScheduleSubmit = async () => {
    if (!scheduleCreds) return;
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      setShowSchedulePopup(false);
      return;
    }
    setError("");
    setIsLoading(true);
    setShowScheduleConfirmPopup(false);
    setIsScheduling(true);
    setShowPinPopup(true);
    try {
      const muValues = { ...formik.values.wallet };
      setScheduledData(muValues);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setScheduleCreds(null);
      setIsLoading(false);
    }
  };

  const handleSubmitScheduleData = async (pin) => {
    if (!pin) return;
    setIsLoading(true);
    try {
      let requestParams = {
        ...scheduledData,
        user_pin: pin,
      };
      const { data } = await apiRequest.createTransactionJarSchedule(
        requestParams
      );
      if (!data.success) throw data;
      setSentDetail({
        heading: "Money Sent",
        message: data.message,
        url: "/assets/images/sent-payment-pop.svg",
      });
      setIsScheduling(false);
      setShowSentPopup(true);
      setShowPinPopup(false);
    } catch (error) {
      setError(error.message);
      if (error.data.is_suspended) {
        navigate("/logout", { replace: true });
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // For validation of inputs with scroll
  useEffect(() => {
    if ((!formik.isSubmitting && !formik.errors) || !formik.errors.wallet)
      return;
    const key = Object.keys(formik.errors.wallet)[0];
    inputAmountRefs?.[key]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [formik.isSubmitting, scrollTop]);

  useEffect(() => {
    // Check if the wallet array is empty and navigate accordingly
    if (!sendCreds?.wallet || sendCreds.wallet.length <= 0) {
      navigate(prevPathRedirect || "/jars/own", { replace: true });
    }
  }, [sendCreds, navigate, prevPathRedirect]);

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
        handleSubmitPin={
          isScheduling ? handleSubmitScheduleData : handleSubmitData
        }
        handleForgotPin={handleForgotPin}
      />
      {OtpModal()}
      {PinModal()}

      {/* Modal For Money Sent successfully */}
      <ModalAlert
        id="money_sent_modal"
        className="money-sent-modal"
        show={showSentPopup}
        heading={sentDetail.heading}
        subHeading={sentDetail.message}
        headingImg={sentDetail.url}
        btnText="Done"
        handleBtnClick={cancelOwnJarPayment}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showScheduleConfirmPopup}
        setShow={setShowScheduleConfirmPopup}
        heading={"Are you sure want to schedule this payment?"}
        subHeading={
          "Once It's done, your scheduled amount will be reserved until payment."
        }
        handleCallback={handleConfirmScheduleSubmit}
      />
      <div className="col-12 send-payment-ttile-wrap">
        <div className="title-content-wrap send-pay-title-sec">
          <h3>{`Transfer One-Time Payment to ${wallet.jar_name} Jar`}</h3>
          <p>Please insert the amount of money you want to add into the Jar</p>
        </div>
      </div>
      {scheduleDate && (
        <div className="RecurringScheduleDateWrap">
          <div className="RSDaterange rs_cm_div">
            <div className="rssvg_wrap">
              <IconScheduledDate />
            </div>
            <div className="rssvg_wrap_inner d-flex align-items-center">
              <div>
                <p>
                  Schedule Date
                  <br />
                  <b>{convertDateFormat(scheduleDate)}</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <!-- payment block form starts -->  */}
      <form onSubmit={formik.handleSubmit}>
        <div className="one-time-pay-sec one-time-pay-wrap">
          <div className="one-time-pay-sec-inner-sec col-12">
            {/* <!-- one time payment block starts -->  */}
            <div className="payment-blocks-wrap">
              <div className="payment-blocks-inner">
                {/* <!-- payment-blocks-listing starts --> */}
                <ul className="payment-blocks-listing">
                  <JarPaymentItem
                    formik={formik}
                    key={0} // Static index since there's only one wallet object
                    item={wallet}
                    fallbackImgUrl={"/assets/images/single_contact_profile.png"}
                    fieldNameAmount={`wallet.deposite_amount`}
                    fieldValueAmount={formik.values?.wallet?.deposite_amount}
                    fieldErrorAmount={
                      formik.touched?.wallet?.deposite_amount &&
                      formik.errors?.wallet?.deposite_amount
                    }
                    fieldNameSpecifications={`wallet.specifications`}
                    fieldValueSpecifications={
                      formik.values?.wallet?.specifications
                    }
                    fieldErrorSpecifications={
                      formik.touched?.wallet?.specifications &&
                      formik.errors?.wallet?.specifications
                    }
                    fieldOnChange={formik.handleChange}
                    fieldOnBlur={formik.handleBlur}
                    showDelete={false} // No need to delete as there's only one wallet
                    handleDelete={handleDeleteContact}
                    disableSpecification={false}
                    disableAmount={false}
                    ref={(el) => (inputAmountRefs[0] = el)} // Single reference since there's only one item
                  />
                </ul>
              </div>
            </div>
            {adminApprovedWithRenewCheck ? (
              <div className="pay-btn-wrap">
                <button
                  type="button"
                  onClick={cancelOwnJarPayment}
                  className="btn btn-cancel-payment"
                >
                  Cancel
                </button>
                {!scheduleDate && (
                  <button
                    type="submit"
                    className="btn btn-send-payment"
                    disabled={formik.isSubmitting}
                    onClick={() => {
                      setIsScheduling(false);
                    }}
                  >
                    Send
                  </button>
                )}
                {scheduleDate && (
                  <button
                    type="button"
                    className="btn btn-send-payment"
                    onClick={handleScheduleSubmit}
                  >
                    Schedule
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </>
  );
}

export default JarSend;
