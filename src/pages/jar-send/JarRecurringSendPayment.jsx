import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";
import { addObjToFormData } from "helpers/commonHelpers";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { isAdminApprovedWithRenewCheck } from "constants/all";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { LoginContext } from "context/loginContext";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import ModalAlert from "components/modals/ModalAlert";
import { IconFrequency, IconScheduledDate } from "styles/svgs";
import JarPaymentItem from "components/items/JarpaymentItem";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { jarCreateSchema } from "schemas/jarSchema";

function JarRecurringSendPayment(_props) {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const inputAmountRefs = useRef([]);
  const { setIsLoading } = useContext(LoaderContext);
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
  const [recurringData, setRecurringData] = useState(null);
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

  const startDate = convertDateFormat(wallet?.recurring_start_date);
  const endDate = convertDateFormat(wallet?.recurring_end_date);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: sendCreds,
    validationSchema: jarCreateSchema,
    onSubmit: async (values) => {},
  });

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
      const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      };
      const muValues = {
        ...formik.values.wallet,
        recurring_start_date: formatDate(
          formik.values.wallet.recurring_start_date
        ),
        recurring_end_date: formatDate(formik.values.wallet.recurring_end_date),
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
      const { jar_id, jar_url, occurrence_count, ...requestData } = {
        ...recurringData,
        user_pin: pin,
      };
      if (jar_url) delete requestData.jar_url;
      if (occurrence_count) delete requestData.occurrence_count;

      const apiMethod = jar_id
        ? apiRequest.addAmountToSavingJarRecurring
        : apiRequest.createTransactionJarRecurring;

      const payload = jar_id
        ? {
            jar_id,
            deposite_amount: requestData.deposite_amount,
            specifications: requestData.specifications,
            schedule_date: requestData.schedule_date,
            recurring_start_date: requestData.recurring_start_date,
            recurring_end_date: requestData.recurring_end_date,
            frequency: requestData.frequency,
            user_pin: requestData.user_pin,
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

  const handleBack = () => {
    navigate("/jars/own/recurring-send", { replace: true });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (recurringData.jar_id) return navigate(-2);
    navigate("/jars/own", { replace: true });
    cancelOwnJarPayment();
  };

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
              {wallet?.recurring_end_date && (
                <div className="divider_date"></div>
              )}
              {wallet?.recurring_end_date && (
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
          {wallet?.target_date && (
            <div className="RSOccurances rs_cm_div">
              <div className="rssvg_wrap">
                <IconScheduledDate />
              </div>
              <p>
                Target Date
                <br />
                <b>{wallet?.target_date.replace(/-/g, "/")}</b>
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
              <b>{wallet?.frequency?.toUpperCase()}</b>
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
                  onClick={handleBack}
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
