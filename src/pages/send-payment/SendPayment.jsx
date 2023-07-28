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
import { useNavigate } from "react-router-dom";
import ModalAlert from "components/modals/ModalAlert";
import { CURRENCY_SYMBOL } from "constants/all";
import { IconClock } from "styles/svgs";
import ModalPaymentScheduler from "components/modals/ModalPaymentScheduler";
import ModalConfirmation from "components/modals/ModalConfirmation";
import WrapAmount from "components/wrapper/WrapAmount";

function SendPayment(props) {
  const navigate = useNavigate();
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

  const { mobile_number, country_code } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { wallet, request_id } = sendCreds || [];

  const [scrollTop, setScrollTop] = useState(false);
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
        muValues.fees = charges;
        muValues.total_amount = paymentDetails.grandTotal;
        for (const key in muValues)
          addObjToFormData(muValues[key], key, formData);
        const { data } = await apiRequest.walletTransferOtp(formData);
        if (!data.success) throw data.message;
        toast.success(`${data?.data?.otp}`);
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

  // For resending the OTP after timeout
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.resendWalletTransferOtp({
        country_code,
        mobile_number,
      });
      if (!data.success) throw data.message;
      toast.success(`${data?.data?.login_otp}`);
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // For deleting the contacts from payment list
  const handleDeleteContact = (ditem) => {
    if (!formik.values) return;
    const { wallet } = formik.values;
    const filteredContacts = wallet?.filter(
      (item) => item.email !== ditem.email && item.mobile !== ditem.mobile
    );
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
    try {
      const formData = new FormData();
      const muValues = { ...formik.values, ...scheduleCreds };
      muValues.schedule_payment = muValues?.wallet?.map(
        ({ specifications, personal_amount, receiver_account_number }) => ({
          specifications,
          personal_amount,
          receiver_account_number,
        })
      );
      muValues.fees = charges;
      muValues.amount = paymentDetails.total;
      muValues.total = paymentDetails.grandTotal;
      delete muValues.wallet;
      for (const key in muValues)
        addObjToFormData(muValues[key], key, formData);
      const { data } = await apiRequest.createSchedulePayment(formData);
      if (!data.success) throw data.message;
      setShowSchedulePopup(false);
      toast.success(`${data.message}`);
      navigate("/view-schedule-payment");
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

  if (!sendCreds?.wallet || sendCreds.wallet.length <= 0)
    navigate(prevPathRedirect || "/send", { replace: true });
  return (
    <>
      {/* Modal For OTP confirmation */}
      <ModalOtpConfirmation
        id="group_pay_otp_modal"
        className="otp-verification-modal group_pay_otp_modal"
        show={showOtpPoup}
        allowClickOutSide={true}
        setShow={setShowOtpPopup}
        heading="OTP Verification"
        headingImg="/assets/images/sent-payment-otp-pop.svg"
        subHeading="We have sent you verification code to initiate payment. Enter OTP below"
        validationSchema={sendPaymentOtpSchema}
        handleSubmitOtp={handleSubmitOtp}
        handleResendOtp={handleResendOtp}
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
          "Once It's done, your scheduled amount will be reserved  until payment."
        }
        handleCallback={handleConfirmScheduleSubmit}
      />
      <div className="col-12 send-payment-ttile-wrap">
        <div className="title-content-wrap send-pay-title-sec">
          <h3>{sendCreds.group_id ? "Group Payment" : "One Time Payment"}</h3>
          <p>Please insert amount of money you want to send</p>
        </div>
      </div>
      {/* <!-- payment block form starts -->  */}
      <form onSubmit={formik.handleSubmit}>
        <div className="one-time-pay-sec one-time-pay-wrap">
          <div className="one-time-pay-sec-inner-sec col-12">
            {/* <!-- one time payment block starts -->	*/}
            <div className="payment-blocks-wrap">
              <div className="payment-blocks-inner">
                {/* <!-- payment-blocks-listing starts --> */}
                <ul className="payment-blocks-listing">
                  {wallet?.map((item, index) => {
                    return (
                      <ContactPaymentItem
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
            <div className="pay-btn-wrap">
              <button
                type="button"
                onClick={handleCancelPayment}
                className="btn btn-cancel-payment"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-send-payment"
                disabled={formik.isSubmitting}
              >
                Send
              </button>
              {!disableEdit && !request_id && (
                <button
                  type="button"
                  className="schedule-pay-btn"
                  onClick={handleSchedulePayment}
                >
                  <IconClock style={{ stroke: "#363853" }} />
                  Schedule Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default SendPayment;
