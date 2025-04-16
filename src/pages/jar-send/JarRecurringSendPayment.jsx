import React, { useContext, useEffect, useRef, useState } from "react";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { isAdminApprovedWithRenewCheck } from "constants/all";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { LoginContext } from "context/loginContext";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import ModalAlert from "components/modals/ModalAlert";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import SectionRecurringDates from "./components/SectionRecurringDates";
import SectionHeader from "./components/SectionHeader";
import SectionRecurringDetails from "./components/SectionRecurringDetails";

function JarRecurringSendPayment(_props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [error, setError] = useState("");
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

  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;

  const { wallet } = sendCreds || [];
  const [updatedWallet, setUpdatedWallet] = useState(wallet);
  const [recurringData, setRecurringData] = useState(null);
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );

  const handleConfirmRecurringSubmit = async () => {
    setIsLoading(true);
    setShowScheduleConfirmPopup(false);
    setError("");
    setShowPinPopup(true);
    try {
      const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      };
      const muValues = {
        ...updatedWallet,
        recurring_start_date: formatDate(updatedWallet.recurring_start_date),
        recurring_end_date: formatDate(updatedWallet.recurring_end_date),
      };
      setRecurringData(muValues);
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
      const { id, jar_id, jar_url, occurrence_count, ...requestData } = {
        ...recurringData,
        user_pin: pin,
      };
      if (jar_url) delete requestData.jar_url;
      if (occurrence_count) delete requestData.occurrence_count;
      if (requestData.total_amount) {
        requestData.deposite_amount = requestData.total_amount;
        delete requestData.total_amount;
      }
      if (requestData.members) {
        delete requestData.members;
      }

      const apiMethod =
        jar_id && id
          ? apiRequest.updateSavingJarRecurringPayment
          : jar_id
          ? apiRequest.addAmountToSavingJarRecurring
          : apiRequest.createTransactionJarRecurring;

      const payload =
        jar_id && id
          ? {
              payment_id: id,
              jar_id,
              deposite_amount: requestData.deposite_amount,
              specifications: requestData.specifications,
              schedule_date: requestData.schedule_date,
              recurring_start_date: requestData.recurring_start_date,
              recurring_end_date: requestData.recurring_end_date,
              frequency: requestData.frequency,
              user_pin: requestData.user_pin,
              occurrences: requestData.occurrences,
            }
          : jar_id
          ? {
              jar_id,
              deposite_amount: requestData.deposite_amount,
              specifications: requestData.specifications,
              schedule_date: requestData.schedule_date,
              recurring_start_date: requestData.recurring_start_date,
              recurring_end_date: requestData.recurring_end_date,
              frequency: requestData.frequency,
              user_pin: requestData.user_pin,
              occurrences: requestData.occurrences,
            }
          : requestData;

      const { data } = await apiMethod(payload);
      if (!data.success) throw data;
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

  const setSomeStateForDetails = (updatedOccurrences) => {
    if (!updatedOccurrences) return;
    const totalAmount = updatedOccurrences
      .reduce((sum, item) => sum + parseFloat(item.amount), 0)
      .toFixed(2);
    setUpdatedWallet((prev) => ({
      ...prev,
      occurrences: updatedOccurrences,
      total_amount: totalAmount,
    }));
  };

  const handleBack = (e) => {
    e.preventDefault();
    const { id, jar_id } = wallet;
    if (id && jar_id) {
      // cancelOwnJarPayment();
      navigate("/jars/own/jar-recurring-pay-list", { replace: true });
    } else {
      navigate(jar_id ? -2 : "/jars/own/create-jar", { replace: true });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(recurringData.jar_id ? -2 : "/jars/own", {
      replace: !recurringData.jar_id,
    });
    cancelOwnJarPayment();
  };

  useEffect(() => {
    if (wallet) setUpdatedWallet(wallet);
  }, [wallet]);

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
        handleBtnClick={handleCancel}
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
          <p>
            Please insert the amount of money you want to add into the
            Sub-account
          </p>
          {/* <Breadcrumb skipIndexes={[2]} /> */}
        </div>
      </div>
      {/* <!-- payment block form starts -->  */}
      <div className="form">
        <div className="one-time-pay-sec one-time-pay-wrap">
          <div className="one-time-pay-sec-inner-sec col-12">
            {/* <!-- one time payment block starts -->	*/}
            <div className="payment-blocks-wrap">
              <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
                {/* <div className="wr-title-wrap">
                  <h3>Sub-account Recurring Payment Details</h3>
                  <ul className="breadcrumb">
                    <li>
                      <Link to={`/jars/own/jar-recurring-pay-list`}>
                        Sub-accounts
                      </Link>
                    </li>
                    <li>Recurring Payment Details</li>
                  </ul>
                </div> */}
                <div className="jar-rc-refund-all-wrap">
                  <div className="jar-rc-refund-main-wrap">
                    <div className="rc-refund-main-inner">
                      <SectionHeader details={updatedWallet} />
                      <div className="rcr-divider-wrap"></div>
                      <SectionRecurringDetails details={updatedWallet} />
                    </div>
                  </div>
                  <div className="jar-rc-refund-second-wrap">
                    <div
                      className="rc-refund-main-inner section-recurring-dates"
                      style={{ scrollbarColor: "#7f8c8d #f4fcfe" }}
                    >
                      <SectionRecurringDates
                        details={updatedWallet.occurrences}
                        setDetails={setSomeStateForDetails}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {adminApprovedWithRenewCheck ? (
              <div className="pay-btn-wrap">
                <button
                  type="button"
                  className="btn btn-cancel-payment"
                  disabled={isLoading}
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-send-payment"
                  disabled={isLoading}
                  onClick={handleConfirmRecurringSubmit}
                >
                  Initiate Recurring
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default JarRecurringSendPayment;
