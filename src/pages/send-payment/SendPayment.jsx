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
import { useNavigate } from "react-router-dom";

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
      if (!data.success) throw data.message;
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <ModalOtpConfirmation
        show={showOtpPoup}
        setShow={setShowOtpPopup}
        heading="OTP Verification"
        headingImg="/assets/images/Send-payment-popup.svg"
        subHeading="We have sent you verification code to initiate group payment. Enter OTP below"
        handleSubmitOtp={handleSubmitOtp}
        handleResendOtp={handleResendOtp}
      />
      <div class="col-12 send-payment-ttile-wrap">
        <div class="title-content-wrap send-pay-title-sec">
          <h3>One Time Payment</h3>
          <p>Please insert amount of money you want to send</p>
        </div>
      </div>
      {/* <!-- payment block form starts -->  */}
      <form onSubmit={formik.handleSubmit}>
        <div class="one-time-pay-sec one-time-pay-wrap">
          <div class="one-time-pay-sec-inner-sec col-12">
            {/* <!-- one time payment block starts -->	*/}
            <div class="payment-blocks-wrap">
              <div class="payment-blocks-inner">
                {/* <!-- payment-blocks-listing starts --> */}
                <ul class="payment-blocks-listing">
                  {wallet.map((item, index) => {
                    return (
                      <ContactPaymentItem
                        key={index}
                        item={item}
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
                <div class="payment-footer-block">
                  <ul>
                    {paymentDetails?.allCharges?.map((item, index) => (
                      <li>
                        <div class="payment-footer-col-label">{item?.desc}</div>
                        <h4 class="amount">
                          <span>NAFl</span> {item?.amount?.toFixed(2)}
                        </h4>
                      </li>
                    ))}
                    <li>
                      <div class="payment-footer-col-label">Total</div>
                      <div class="amount-currency-wrap">
                        <h4 class="amount">
                          <span>NAFl</span>{" "}
                          {paymentDetails?.grandTotal?.toFixed(2)}
                        </h4>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="pay-btn-wrap">
              <button href="#" class="btn btn-cancel-payment">
                Cancel
              </button>
              <button type="submit" class="btn btn-send-payment">
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
