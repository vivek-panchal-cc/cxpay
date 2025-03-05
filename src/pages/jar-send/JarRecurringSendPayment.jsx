import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { SendPaymentContext } from "context/sendPaymentContext";
import ContactPaymentItem from "components/items/ContactPaymentItem";
import {
  sendPaymentSchema,
  sendPaymentOtpSchema,
  sendPaymentPinSchema,
} from "schemas/sendPaymentSchema";
import {
  addObjToFormData,
  getChargedAmount,
  getChargedCommissionAmount,
} from "helpers/commonHelpers";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CURRENCY_SYMBOL, isAdminApprovedWithRenewCheck } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import ModalConfirmation from "components/modals/ModalConfirmation";
import ModalPaymentSchedulerRecurring from "components/modals/ModalPaymentSchedulerRecurring";
import ModalOtpConfirmation from "components/modals/ModalOtpConfirmation";
import { LoginContext } from "context/loginContext";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import ModalAlert from "components/modals/ModalAlert";
import { IconFrequency, IconOccurrence, IconScheduledDate } from "styles/svgs";
import JarPaymentItem from "components/items/JarpaymentItem";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { jarCreateSchema } from "schemas/jarSchema";

// Track the number of failed attempts
let failedAttempts = 1;
let cancelAttempts = 0;

function JarRecurringSendPayment(_props) {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const inputAmountRefs = useRef([]);
  const { setIsLoading } = useContext(LoaderContext);
  const [error, setError] = useState("");
  const [showOtpPoup, setShowOtpPopup] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showScheduleConfirmPopup, setShowScheduleConfirmPopup] =
    useState(false);
  const [scheduleCreds, setScheduleCreds] = useState(null);
  const [showSentPopup, setShowSentPopup] = useState(false);
  const [sentDetail, setSentDetail] = useState({
    heading: "",
    message: "",
    url: "",
  });
  const [showPinPopup, setShowPinPopup] = useState(false);
  const { handleForgotPin, OtpModal, PinModal } =
    useForgotPinHandler(setShowPinPopup);

  const { sendCreds, prevPathRedirect, cancelOwnJarPayment } =
    useContext(SavingJarOwnContext);

  const { mobile_number, country_code, admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;

  const { wallet } = sendCreds || [];
  const [recurringData, setRecurringData] = useState(null);
  const [attempts, setAttempts] = useState(failedAttempts);
  const [cancelAttempts, setCancelAttempts] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    total: 0.0,
  });
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );

  const convertDateFormat = (dateString) => {
    let dateObj = new Date(dateString);
    let dd = String(dateObj.getDate()).padStart(2, "0"); // get day and pad with 0 if needed
    let mm = String(dateObj.getMonth() + 1).padStart(2, "0"); // get month (0 indexed) and pad with 0 if needed
    let yyyy = dateObj.getFullYear();

    // Format and return the date
    return `${dd}/${mm}/${yyyy}`;
  };

  const startDate = convertDateFormat(formData?.start_date);
  const endDate = convertDateFormat(formData?.end_date);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: sendCreds,
    validationSchema: jarCreateSchema,
    onSubmit: async (values) => {
      try {
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
        muValues.fees = charges;
        muValues.total_amount = paymentDetails.grandTotal;
        for (const key in muValues)
          addObjToFormData(muValues[key], key, formData);
        const { data } = await apiRequest.createRecurringPayment(formData);
        if (!data.success) throw data.message;
        toast.success(`${data.message}`);
        navigate("/view-recurring-payment");
      } catch (error) {
        if (typeof error === "string") toast.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const convertDateFormatToAppend = (dateStr) => {
    if (!dateStr || dateStr.includes("NaN")) return "";
    const [day, month, year] = dateStr.split("/");
    return `${month}/${day}/${year}`;
  };

  const handleConfirmRecurringSubmit = async (scheduleDetails) => {
    setScheduleCreds(scheduleDetails);
    // if (!scheduleCreds) return;
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      setShowSchedulePopup(false);
      return;
    }
    setIsLoading(true);
    setShowScheduleConfirmPopup(false);
    setError("");
    setShowPinPopup(true);
    try {
      const formDataAppend = new FormData();
      const muValues = { ...formik.values, ...scheduleCreds };
      const formattedData = {
        schedule_payment: muValues?.wallet?.map((walletItem) => ({
          specification: walletItem.specifications,
          amount: walletItem.personal_amount,
          receiver_account_number: walletItem.receiver_account_number,
          user_type: walletItem.user_type,
          fees_deduct_account: walletItem.merchant_fees?.fees_deduct_account,
          merchant_fees_amount: walletItem.merchant_fees?.merchant_fees,
          merchant_fees_type: walletItem.merchant_fees?.merchant_fees_type,
          merchant_fees_capacity:
            walletItem.merchant_fees?.merchant_fees_capacity || 0.0,
        })),
        fees: charges?.length > 0 ? charges : "",
        total: paymentDetails.grandTotal.toString(),
        // schedule_date: muValues.schedule_date,
        schedule_date: new Date().toISOString().split("T")[0],
        // overall_specification: muValues.overall_specification,
        group_id: sendCreds?.group_id ? sendCreds?.group_id : "",
        amount: paymentDetails?.total.toString(),
        recurring_start_date: convertDateFormatToAppend(startDate),
        recurring_end_date: convertDateFormatToAppend(endDate ? endDate : ""),
        no_of_occurrence:
          formData?.occurrence_count === 0
            ? ""
            : formData?.occurrence_count.toString(),
        frequency: formData?.select_frequency_id,
      };
      delete muValues.wallet;
      for (const key in formattedData)
        addObjToFormData(formattedData[key], key, formDataAppend);

      // const { data } = await apiRequest.walletTransferRecurringOtp(
      //   formDataAppend
      // );
      // if (!data.success) throw data.message;
      // Store the formData values in scheduledData
      setRecurringData(formDataAppend);
      // if (data?.data?.otp) toast.success(`${data?.data?.otp}`);
      // toast.success(`${data.message}`);
      // setShowOtpPopup(true);
      // const { data } = await apiRequest.createRecurringPayment(formDataAppend);
      // if (!data.success) throw data.message;
      // setShowSchedulePopup(false);
      // toast.success(`${data.message}`);
      // delete muValues.wallet;
      // navigate("/view-recurring-payment");
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setScheduleCreds(null);
      setIsLoading(false);
    }
  };

  const handleSubmitRecurringData = async (pin) => {
    if (!pin) return;
    setIsLoading(true);
    try {
      const formData = recurringData;
      if (formData.has("user_pin")) {
        formData.delete("user_pin");
      }
      formData.append("user_pin", pin);
      const { data } = await apiRequest.recurringPaymentPin(formData);
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

  const handleSubmitRecurringOtp = async (otp) => {
    if (!otp || !mobile_number || !country_code) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      for (const key in recurringData) {
        formData.append(key, recurringData[key]);
      }
      formData.append("user_otp", otp);
      const { data } = await apiRequest.createRecurringPayment(formData);
      if (!data.success) {
        setAttempts((prevAttempts) => prevAttempts + 1);
        if (attempts >= 3) {
          cancelOwnJarPayment();
          toast.error("Your payment has been declined.");
          navigate("/send", { replace: true });
          return false; // Stop execution to prevent further processing
        }
        throw data.message;
      }
      toast.success(`${data.message}`);
      setShowOtpPopup(false);
      navigate("/view-recurring-payment");
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendRecurringOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.resendRecurringPaymentOtp();
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
      cancelOwnJarPayment();
      toast.error("Your payment has been declined.");
      navigate("/send", { replace: true });
      // Reset cancelAttempts after triggering the declined payment
      setCancelAttempts(0);
      return;
    }
    setShowOtpPopup(false);
  };

  // For deleting the contacts from payment list
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
  const handleRecurringPayment = async () => {
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
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      setScrollTop((cs) => !cs);
      return;
    }
    setShowSchedulePopup(false);
    setScheduleCreds(scheduleDetails);
    setShowScheduleConfirmPopup(true);
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
  }, [formik.isSubmitting]);

  const handleCancel = () => {
    navigate("/jars/own", { replace: true });
    cancelOwnJarPayment();
  };

  // useEffect(() => {
  //   // Check if the wallet array is empty and navigate accordingly
  //   if (!sendCreds?.wallet || sendCreds.wallet.length <= 0) {
  //     navigate(prevPathRedirect || "/jars/own", { replace: true });
  //   }
  // }, [sendCreds, navigate, prevPathRedirect]);

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
        handleSubmitPin={handleSubmitRecurringData}
        handleForgotPin={handleForgotPin}
      />
      {OtpModal()}
      {PinModal()}
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
        handleSubmitOtp={handleSubmitRecurringOtp}
        handleResendOtp={handleResendRecurringOtp}
      />

      <ModalPaymentSchedulerRecurring
        classNameChild="schedule-time-modal"
        show={showSchedulePopup}
        setShow={setShowSchedulePopup}
        handleSubmit={handleScheduleSubmit}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showScheduleConfirmPopup}
        setShow={setShowScheduleConfirmPopup}
        heading={"Are you sure want to schedule this recurring payment?"}
        subHeading={
          "Once It's done, your scheduled amount will be reserved until payment."
        }
        handleCallback={handleConfirmRecurringSubmit}
      />
      <div className="col-12 send-payment-ttile-wrap">
        <div className="title-content-wrap send-pay-title-sec">
          <h3>
            {sendCreds.group_id
              ? "Group Recurring Payment"
              : "Recurring Payment"}
          </h3>
          <Breadcrumb skipIndexes={[2]} />
        </div>
      </div>
      {/* <!-- payment block form starts -->  */}
      <form onSubmit={formik.handleSubmit}>
        <div className="RecurringScheduleDateWrap">
          <div className="RSDaterange rs_cm_div">
            <div className="rssvg_wrap">
              <IconScheduledDate />
            </div>
            <div className="rssvg_wrap_inner d-flex align-items-center">
              <div>
                <p>
                  Start Date
                  <br />
                  <b>{startDate}</b>
                </p>
              </div>
              {formData?.end_date && <div className="divider_date"></div>}
              {formData?.end_date && (
                <div>
                  <p>
                    End Date
                    <br />
                    <b>{endDate}</b>
                  </p>
                </div>
              )}
            </div>
          </div>
          {formData?.occurrence_count.toString() !== "0" && (
            <div className="RSOccurances rs_cm_div">
              <div className="rssvg_wrap">
                <IconOccurrence />
              </div>
              <p>
                No. of Occurances
                <br />
                <b>{formData?.occurrence_count}</b>
              </p>
            </div>
          )}
          <div className="RSFrequency rs_cm_div">
            <div className="rssvg_wrap">
              <IconFrequency />
            </div>
            <p>
              Frequency
              <br />
              <b>{formData?.select_frequency_id.toUpperCase()}</b>
            </p>
          </div>
        </div>
        <div className="one-time-pay-sec one-time-pay-wrap">
          <div className="one-time-pay-sec-inner-sec col-12">
            {/* <!-- one time payment block starts -->	*/}
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
                  onClick={handleCancel}
                  className="btn btn-cancel-payment"
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-send-payment"
                  disabled={formik.isSubmitting}
                  onClick={handleConfirmRecurringSubmit}
                >
                  Initiate Recurring
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </>
  );
}

export default JarRecurringSendPayment;
