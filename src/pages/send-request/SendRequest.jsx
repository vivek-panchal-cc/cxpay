import React, { useContext, useState, useEffect, useRef } from "react";
import ModalAlert from "components/modals/ModalAlert";
import ModalOtpConfirmation from "components/modals/ModalOtpConfirmation";
import { SendPaymentContext } from "context/sendPaymentContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoaderContext } from "context/loaderContext";
import {
  sendPaymentOtpSchema,
  sendRequestSchema,
} from "schemas/sendPaymentSchema";
import ContactPaymentItem from "components/items/ContactPaymentItem";
import { toast } from "react-toastify";
import { addObjToFormData, getChargedAmount } from "helpers/commonHelpers";
import { apiRequest } from "helpers/apiRequests";
import { CURRENCY_SYMBOL } from "constants/all";

const SendRequest = () => {
  const navigate = useNavigate();
  const inputAmountRefs = useRef([]);
  const { handleSendCreds, requestCreds } = useContext(SendPaymentContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { wallet } = requestCreds || [];

  const [showOtpPoup, setShowOtpPopup] = useState(false);
  const [showSentPopup, setShowSentPopup] = useState(false);
  const [moneySentMsg, setMoneySentMsg] = useState("");
  const [moneySentPopupUrl, setMoneySentPopupUrl] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    total: 0.0,
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: requestCreds,
    validationSchema: sendRequestSchema,
    onSubmit: async (values, { setValues, setErrors }) => {
      try {
        if (showOtpPoup || showSentPopup) return;
        setIsLoading(true);
        const formData = new FormData();
        const muValues = { ...values };
        muValues.wallet = muValues?.wallet?.map(
          ({ mobile, specifications, amount, receiver_account_number }) => ({
            mobile,
            specifications,
            amount,
            receiver_account_number,
          })
        );
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

  // For calculating charges when amount changes for any contact
  useEffect(() => {
    if (!formik.values.wallet) return;
    const amounts = formik.values.wallet?.map((item) =>
      item.amount && !isNaN(item.amount) ? parseFloat(item.amount) : 0
    );
    setPaymentDetails(getChargedAmount([], amounts));
  }, [formik.values?.wallet]);

  if (!requestCreds || !requestCreds.wallet || requestCreds.wallet.length <= 0)
    navigate("/request", { replace: true });

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
        handleSubmitOtp={() => {}}
        handleResendOtp={() => {}}
      />
      {/* Modal For Money Sent successfully */}
      <ModalAlert
        id="money_sent_modal"
        className="money-sent-modal"
        show={showSentPopup}
        heading="Money Sent"
        subHeading={moneySentMsg}
        headingImg={moneySentPopupUrl}
        btnText="Done"
        handleBtnClick={() => {}}
      />
      <div className="col-12 send-payment-ttile-wrap">
        <div className="title-content-wrap send-pay-title-sec">
          <h3> Request </h3>
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
                        key={index}
                        item={item}
                        fallbackImgUrl={
                          "assets/images/single_contact_profile.png"
                        }
                        fieldNameAmount={`wallet[${index}].amount`}
                        fieldValueAmount={
                          formik.values?.wallet?.[index]?.amount
                        }
                        fieldErrorAmount={
                          formik.touched?.wallet?.[index]?.amount &&
                          formik.errors?.wallet?.[index]?.amount
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
                        handleDelete={() => {}}
                        ref={(el) => (inputAmountRefs[index] = el)}
                      />
                    );
                  })}
                </ul>
                {/* <!-- payment blocks footer section starts --> */}
                <div className="payment-footer-block">
                  <ul>
                    <li>
                      <div className="payment-footer-col-label">Total</div>
                      <div className="amount-currency-wrap">
                        <h4 className="amount">
                          <span>{CURRENCY_SYMBOL}</span>{" "}
                          {paymentDetails?.grandTotal?.toFixed(2)}
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
                onClick={() => {}}
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
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SendRequest;
