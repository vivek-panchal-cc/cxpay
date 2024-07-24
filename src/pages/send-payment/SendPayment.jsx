import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { SendPaymentContext } from "context/sendPaymentContext";
import ContactPaymentItem from "components/items/ContactPaymentItem";
import {
  sendPaymentOtpSchema,
  sendPaymentSchema,
} from "schemas/sendPaymentSchema";
import { addObjToFormData, getChargedAmount } from "helpers/commonHelpers";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import ModalOtpConfirmation from "components/modals/ModalOtpConfirmation";
import { LoaderContext } from "context/loaderContext";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ModalAlert from "components/modals/ModalAlert";
import { CURRENCY_SYMBOL, isAdminApprovedWithRenewCheck } from "constants/all";
import { IconClock } from "styles/svgs";
import ModalPaymentScheduler from "components/modals/ModalPaymentScheduler";
import ModalConfirmation from "components/modals/ModalConfirmation";
import WrapAmount from "components/wrapper/WrapAmount";
import { LoginContext } from "context/loginContext";

// Track the number of failed attempts
let failedAttempts = 1;
let cancelAttempts = 0;

function SendPayment(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const scheduleDate = location?.state?.scheduleDate;
  const inputAmountRefs = useRef([]);
  const { setIsLoading } = useContext(LoaderContext);
  const {
    sendCreds,
    charges,
    disableEdit,
    handleSendCreds,
    handleCancelPayment,
    prevPathRedirect,
  } = useContext(SendPaymentContext);

  const { mobile_number, country_code, admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
  const { wallet, request_id } = sendCreds || [];

  const [scrollTop, setScrollTop] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showOtpPoup, setShowOtpPopup] = useState(false);
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
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    total: 0.0,
  });
  const [scheduledData, setScheduledData] = useState(null);
  const [attempts, setAttempts] = useState(failedAttempts);
  const [cancelAttempts, setCancelAttempts] = useState(0);

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
    validationSchema: sendPaymentSchema,
    onSubmit: async (values, { setValues, setErrors }) => {
      try {
        if (showOtpPoup || showSentPopup) return;
        setIsLoading(true);
        const formData = new FormData();
        const muValues = { ...values };
        muValues.wallet = muValues?.wallet?.map(
          ({ specifications, personal_amount, receiver_account_number }) => ({
            specifications,
            personal_amount,
            receiver_account_number,
          })
        );
        muValues.fees = charges?.length > 0 ? charges : "";
        muValues.total_amount = paymentDetails.grandTotal;
        for (const key in muValues)
          addObjToFormData(muValues[key], key, formData);
        const { data } = await apiRequest.walletTransferOtp(formData);
        if (!data.success) throw data.message;
        if (data?.data?.otp) toast.success(`${data?.data?.otp}`);
        toast.success(`${data.message}`);
        setShowOtpPopup(true);
      } catch (error) {
        if (typeof error === "string") toast.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // For submitting OTP to API to make payment
  const handleSubmitOtp = async (otp) => {
    if (!otp || !mobile_number || !country_code) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.walletPersonalOtpVerify({
        country_code,
        mobile_number,
        wallet_transfer_otp: otp,
      });
      if (!data.success) throw data;
      toast.success(data.message);
      setSentDetail({
        heading: "Money Sent",
        message: data.message,
        url: "/assets/images/sent-payment-pop.svg",
      });
      setShowSentPopup(true);
      return true;
    } catch (error) {
      const { message, data } = error || {};
      const { wrong_otp_attempts } = data || {};
      if (wrong_otp_attempts && wrong_otp_attempts >= 3) {
        handleCancelPayment();
        toast.error(message);
        navigate("/send", { replace: true });
      } else if (typeof message === "string" && !wrong_otp_attempts) {
        setShowOtpPopup(false);
        setSentDetail({
          heading: message,
          message: "",
          url: "/assets/images/sent-payment-failed-pop.svg",
        });
        setShowSentPopup(true);
        return false;
      } else if (typeof message === "string") toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitScheduleOtp = async (otp) => {
    if (!otp || !mobile_number || !country_code) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      for (const key in scheduledData) {
        formData.append(key, scheduledData[key]);
      }
      formData.append("user_otp", otp);
      const { data } = await apiRequest.createSchedulePayment(formData);
      if (!data.success) {
        setAttempts((prevAttempts) => prevAttempts + 1);
        if (attempts >= 3) {
          handleCancelPayment();
          toast.error("Your payment has been declined.");
          navigate("/send", { replace: true });
          return false; // Stop execution to prevent further processing
        }
        throw data.message;
      }
      toast.success(`${data.message}`);
      setIsScheduling(false);
      setShowOtpPopup(false);
      navigate("/view-schedule-payment");
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // For resending the OTP after timeout
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.resendWalletTransferOtp({
        country_code,
        mobile_number,
      });
      if (!data.success) throw data.message;
      if (data?.data?.login_otp) toast.success(`${data?.data?.login_otp}`);
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendScheduleOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.resendSchedulePaymentOtp();
      if (!data.success) throw data.message;
      if (data?.data?.otp) toast.success(`${data?.data?.otp}`);
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // New function with the cancel logic
  const handleCancelRecurringPayment = () => {
    // Increment cancelAttempts
    setCancelAttempts((prevAttempts) => prevAttempts + 1);

    // Check if cancelAttempts reaches 3
    if (cancelAttempts === 2) {
      handleCancelPayment();
      toast.error("Your payment has been declined.");
      navigate("/send", { replace: true });
      // Reset cancelAttempts after triggering the declined payment
      setCancelAttempts(0);
      return;
    }
    setShowOtpPopup(false);
  };

  // // For deleting the contacts from payment list
  // const handleDeleteContact = (ditem) => {
  //   if (!formik.values) return;
  //   const { wallet } = formik.values;
  //   const filteredContacts = wallet?.filter(
  //     (item) => item.email !== ditem.email && item.mobile !== ditem.mobile
  //   );
  //   handleSendCreds(filteredContacts);
  // };

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

  // For getting credentials for scheduling payment
  const handleSchedulePayment = async () => {
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      setScrollTop((cs) => !cs);
      return;
    }
    setShowSchedulePopup(true);
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
    setIsLoading(true);
    setShowScheduleConfirmPopup(false);
    setIsScheduling(true);
    try {
      const formData = new FormData();
      const muValues = { ...formik.values };
      muValues.schedule_payment = muValues?.wallet?.map(
        ({ specifications, personal_amount, receiver_account_number }) => ({
          specifications,
          personal_amount,
          receiver_account_number,
        })
      );
      muValues.fees = charges?.length > 0 ? charges : "";
      muValues.amount = paymentDetails.total;
      muValues.total = paymentDetails.grandTotal;
      muValues.schedule_date = scheduleDate;
      delete muValues.wallet;
      for (const key in muValues)
        addObjToFormData(muValues[key], key, formData);
      const { data } = await apiRequest.walletTransferScheduleOtp(formData);
      if (!data.success) throw data.message;
      // Store the formData values in scheduledData
      setScheduledData(Object.fromEntries(formData));
      if (data?.data?.otp) toast.success(`${data?.data?.otp}`);
      toast.success(`${data.message}`);
      setShowOtpPopup(true);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setScheduleCreds(null);
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

  // For calculating charges when amount changes for any contact
  useEffect(() => {
    if (!formik.values.wallet) return;
    const amounts = formik.values.wallet?.map((item) =>
      item?.personal_amount?.trim() && !isNaN(item.personal_amount.trim())
        ? parseFloat(item.personal_amount)
        : 0
    );
    setPaymentDetails(getChargedAmount(charges, amounts));
  }, [formik.values?.wallet, charges]);

  useEffect(() => {
    // Check if the wallet array is empty and navigate accordingly
    if (!sendCreds?.wallet || sendCreds.wallet.length <= 0) {
      navigate(prevPathRedirect || "/send", { replace: true });
    }
  }, [sendCreds, navigate, prevPathRedirect]);

  // if (!sendCreds?.wallet || sendCreds.wallet.length <= 0)
  //   navigate(prevPathRedirect || "/send", { replace: true });
  return (
    <>
      {/* Modal For OTP confirmation */}
      <ModalOtpConfirmation
        id="group_pay_otp_modal"
        className="otp-verification-modal group_pay_otp_modal"
        show={showOtpPoup}
        allowClickOutSide={true}
        // setShow={setShowOtpPopup}
        setShow={() => {
          // Call your new function with the cancel logic
          handleCancelRecurringPayment();
        }}
        heading="OTP Verification"
        headingImg="/assets/images/sent-payment-otp-pop.svg"
        subHeading="We have sent you verification code to initiate payment. Enter OTP below"
        validationSchema={sendPaymentOtpSchema}
        handleSubmitOtp={
          isScheduling ? handleSubmitScheduleOtp : handleSubmitOtp
        }
        handleResendOtp={
          isScheduling ? handleResendScheduleOtp : handleResendOtp
        }
      />
      {/* Modal For Money Sent successfully */}
      <ModalAlert
        id="money_sent_modal"
        className="money-sent-modal"
        show={showSentPopup}
        heading={sentDetail.heading}
        subHeading={sentDetail.message}
        headingImg={sentDetail.url}
        btnText="Done"
        handleBtnClick={handleCancelPayment}
      />
      <ModalPaymentScheduler
        classNameChild="schedule-time-modal"
        show={showSchedulePopup}
        setShow={setShowSchedulePopup}
        handleSubmit={handleScheduleSubmit}
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
          <h3>{sendCreds.group_id ? "Group Payment" : "One Time Payment"}</h3>
          <p>Please insert amount of money you want to send</p>
        </div>
      </div>
      {scheduleDate && (
        <div className="RecurringScheduleDateWrap">
          <div className="RSDaterange rs_cm_div">
            <div className="rssvg_wrap">
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.744964 12.562C2.12034 6.69857 6.69857 2.12034 12.562 0.744962C16.7965 -0.24832 21.2035 -0.248321 25.438 0.744961C31.3014 2.12034 35.8797 6.69858 37.255 12.562C38.2483 16.7965 38.2483 21.2035 37.255 25.438C35.8797 31.3014 31.3014 35.8797 25.438 37.255C21.2035 38.2483 16.7965 38.2483 12.562 37.255C6.69858 35.8797 2.12034 31.3014 0.744964 25.438C-0.248321 21.2035 -0.248321 16.7965 0.744964 12.562Z"
                  fill="#936EE3"
                />
                <path
                  d="M25.1111 11H11.8889C10.8457 11 10 11.8457 10 12.8889V26.1111C10 27.1543 10.8457 28 11.8889 28H25.1111C26.1543 28 27 27.1543 27 26.1111V12.8889C27 11.8457 26.1543 11 25.1111 11Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 10V13"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 10V13"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 17H27"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
                  {wallet?.map((item, index) => {
                    return (
                      <ContactPaymentItem
                        formik={formik}
                        key={item?.mobile || index}
                        item={item}
                        fallbackImgUrl={
                          "/assets/images/single_contact_profile.png"
                        }
                        fieldNameAmount={`wallet[${index}].personal_amount`}
                        fieldValueAmount={
                          formik.values?.wallet?.[index]?.personal_amount
                        }
                        fieldErrorAmount={
                          formik.touched?.wallet?.[index]?.personal_amount &&
                          formik.errors?.wallet?.[index]?.personal_amount
                        }
                        fieldNameSpecifications={`wallet[${index}].specifications`}
                        fieldValueSpecifications={
                          formik.values?.wallet?.[index]?.specifications
                        }
                        fieldErrorSpecifications={
                          formik.touched?.wallet?.[index]?.specifications &&
                          formik.errors?.wallet?.[index]?.specifications
                        }
                        fieldOnChange={formik.handleChange}
                        fieldOnBlur={formik.handleBlur}
                        showDelete={wallet.length > 1 ? true : false}
                        handleDelete={handleDeleteContact}
                        disableSpecification={disableEdit}
                        disableAmount={disableEdit}
                        ref={(el) => (inputAmountRefs[index] = el)}
                      />
                    );
                  })}
                </ul>
                {/* <!-- payment blocks footer section starts --> */}
                <div className="payment-footer-block">
                  <ul>
                    <li>
                      <div className="payment-footer-col-label">Amount</div>
                      <div className="amount-currency-wrap">
                        <h4 className="amount">
                          <span>{CURRENCY_SYMBOL}</span>
                          <WrapAmount value={paymentDetails?.total} prefix="" />
                        </h4>
                      </div>
                    </li>
                    {paymentDetails?.allCharges?.map((item, index) => (
                      <li key={item?.desc || index}>
                        <div className="payment-footer-col-label">
                          {item?.desc}
                        </div>
                        <h4 className="amount">
                          <span>{CURRENCY_SYMBOL}</span>
                          <WrapAmount value={item?.amount} prefix="" />
                        </h4>
                      </li>
                    ))}
                    <li>
                      <div className="payment-footer-col-label">
                        Net Payable
                      </div>
                      <div className="amount-currency-wrap">
                        <h4 className="amount">
                          <span>{CURRENCY_SYMBOL}</span>
                          <WrapAmount
                            value={paymentDetails?.grandTotal}
                            prefix=""
                          />
                        </h4>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {adminApprovedWithRenewCheck ? (
              <div className="pay-btn-wrap">
                <button
                  type="button"
                  onClick={handleCancelPayment}
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
                {/* {!disableEdit && !request_id && (
                <button
                  type="button"
                  className="schedule-pay-btn"
                  onClick={handleSchedulePayment}
                >
                  <IconClock style={{ stroke: "#363853" }} />
                  Schedule Payment
                </button>
              )} */}
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </>
  );
}

export default SendPayment;
