import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { SendPaymentContext } from "context/sendPaymentContext";
import ContactPaymentItem from "components/items/ContactPaymentItem";
import { sendPaymentSchema } from "schemas/sendPaymentSchema";
import { getChargedAmount } from "helpers/commonHelpers";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import ModalOtpConfirmation from "components/modals/ModalOtpConfirmation";
import { LoaderContext } from "context/loaderContext";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ModalAlert from "components/modals/ModalAlert";

function SendPayment(props) {
  const {} = props;
  const navigate = useNavigate();
  const inputAmountRefs = useRef([]);
  const { setIsLoading } = useContext(LoaderContext);
  const { sendCreds, handleSendCreds, charges } =
    useContext(SendPaymentContext);
  const { mobile_number } = useSelector((state) => state?.userProfile?.profile);
  const { wallet } = sendCreds || [];

  const [showOtpPoup, setShowOtpPopup] = useState(false);
  const [showSentPopup, setShowSentPopup] = useState(false);
  const [moneySentMsg, setMoneySentMsg] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    total: 0.0,
  });

  const formik = useFormik({
    initialValues: sendCreds,
    validationSchema: sendPaymentSchema,
    onSubmit: async (values, { setValues, setErrors }) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
        const muValues = { ...values };
        muValues.wallet = muValues?.wallet?.map(
          ({
            mobile,
            specifications,
            personal_amount,
            receiver_account_number,
          }) => ({
            mobile,
            specifications,
            personal_amount,
            receiver_account_number,
          })
        );
        muValues.fees = charges;
        muValues.total_amount = paymentDetails.grandTotal;
        for (const key in muValues) formData.append(key, muValues[key]);
        const { data } = await apiRequest.walletTransferOtp(formData);
        if (!data.success) throw data.message;
        toast.success(data.data.otp);
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
    if (!otp || !mobile_number) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.walletPersonalOtpVerify({
        mobile_number,
        wallet_transfer_otp: otp,
      });
      if (!data.success) throw data;
      toast.success(data.message);
      setMoneySentMsg(data.message);
      setShowSentPopup(true);
      return true;
    } catch (error) {
      const { message, data } = error || {};
      const { wrong_otp_attempts } = data || {};
      if (wrong_otp_attempts && wrong_otp_attempts >= 3) {
        handleSendCreds([]);
        navigate("/send", { replace: true });
      }
      if (typeof message === "string") toast.error(message);
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
        mobile_number,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // For deleting the contacts from payment list
  const handleDeleteContact = (ditem) => {
    const filteredContacts = wallet?.filter(
      (item) => item.email !== ditem.email && item.mobile !== ditem.mobile
    );
    handleSendCreds(filteredContacts);
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

  // For calculating charges when amount changes for any contact
  useEffect(() => {
    if (!formik.values.wallet) return;
    const amounts = formik.values.wallet.map((item) =>
      item.personal_amount ? parseFloat(item.personal_amount) : 0
    );
    setPaymentDetails(getChargedAmount(charges, amounts));
  }, [formik.values?.wallet]);

  if (!sendCreds || !sendCreds.wallet || sendCreds.wallet.length <= 0)
    navigate("/send", { replace: true });
  return (
    <>
      {/* Modal For OTP confirmation */}
      <ModalOtpConfirmation
        id="group_pay_otp_modal"
        className="otp-verification-modal group_pay_otp_modal"
        show={showOtpPoup}
        setShow={setShowOtpPopup}
        heading="OTP Verification"
        headingImg="/assets/images/send-payment-pop.svg"
        subHeading="We have sent you verification code to initiate group payment. Enter OTP below"
        handleSubmitOtp={handleSubmitOtp}
        handleResendOtp={handleResendOtp}
      />
      {/* Moadal For Money Sent successfully */}
      <ModalAlert
        id="money_sent_modal"
        className="money-sent-modal"
        show={showSentPopup}
        heading="Money Sent"
        subHeading={moneySentMsg}
        headingImg="/assets/images/sent-payment-pop.svg"
        linkText="Done"
        linkRedirect="/send"
      />
      <div className="col-12 send-payment-ttile-wrap">
        <div className="title-content-wrap send-pay-title-sec">
          <h3>One Time Payment</h3>
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
                  {wallet.map((item, index) => {
                    return (
                      <ContactPaymentItem
                        key={index}
                        item={item}
                        fallbackImgUrl={
                          "assets/images/single_contact_profile.png"
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
                        fieldOnChange={formik.handleChange}
                        fieldOnBlur={formik.handleBlur}
                        handleDelete={handleDeleteContact}
                        ref={(el) => (inputAmountRefs[index] = el)}
                      />
                    );
                  })}
                </ul>
                {/* <!-- payment blocks footer section starts --> */}
                <div className="payment-footer-block">
                  <ul>
                    {paymentDetails?.allCharges?.map((item, index) => (
                      <li>
                        <div className="payment-footer-col-label">
                          {item?.desc}
                        </div>
                        <h4 className="amount">
                          <span>NAFl</span> {item?.amount?.toFixed(2)}
                        </h4>
                      </li>
                    ))}
                    <li>
                      <div className="payment-footer-col-label">Total</div>
                      <div className="amount-currency-wrap">
                        <h4 className="amount">
                          <span>NAFl</span>{" "}
                          {paymentDetails?.grandTotal?.toFixed(2)}
                        </h4>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pay-btn-wrap">
              <Link to={"/send"} className="btn btn-cancel-payment">
                Cancel
              </Link>
              <button type="submit" className="btn btn-send-payment">
                Send
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default SendPayment;