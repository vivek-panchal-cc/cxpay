import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { SendPaymentContext } from "context/sendPaymentContext";
import ContactPaymentItem from "components/items/ContactPaymentItem";
import { sendPaymentSchema } from "schemas/sendPaymentSchema";
import { addObjToFormData, getChargedAmount } from "helpers/commonHelpers";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CURRENCY_SYMBOL } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import ModalConfirmation from "components/modals/ModalConfirmation";
import ModalPaymentSchedulerRecurring from "components/modals/ModalPaymentSchedulerRecurring";

function SendRecurringPayment(_props) {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const inputAmountRefs = useRef([]);
  const { setIsLoading } = useContext(LoaderContext);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showScheduleConfirmPopup, setShowScheduleConfirmPopup] =
    useState(false);
  const [scheduleCreds, setScheduleCreds] = useState(null);

  const { sendCreds, charges, disableEdit, handleSendCreds, prevPathRedirect } =
    useContext(SendPaymentContext);

  const { mobile_number, country_code } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { wallet } = sendCreds || [];

  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    total: 0.0,
  });

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
    validationSchema: sendPaymentSchema,
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
    try {
      const formDataAppend = new FormData();
      const muValues = { ...formik.values, ...scheduleCreds };
      const formattedData = {
        schedule_payment: muValues?.wallet?.map((walletItem) => ({
          specification: walletItem.specifications,
          amount: walletItem.personal_amount,
          receiver_account_number: walletItem.receiver_account_number,
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
      for (const key in formattedData)
        addObjToFormData(formattedData[key], key, formDataAppend);
      const { data } = await apiRequest.createRecurringPayment(formDataAppend);
      if (!data.success) throw data.message;
      setShowSchedulePopup(false);
      toast.success(`${data.message}`);
      delete muValues.wallet;
      navigate("/view-recurring-payment");
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setScheduleCreds(null);
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
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.744964 12.562C2.12034 6.69857 6.69857 2.12034 12.562 0.744962C16.7965 -0.24832 21.2035 -0.248321 25.438 0.744961C31.3014 2.12034 35.8797 6.69858 37.255 12.562C38.2483 16.7965 38.2483 21.2035 37.255 25.438C35.8797 31.3014 31.3014 35.8797 25.438 37.255C21.2035 38.2483 16.7965 38.2483 12.562 37.255C6.69858 35.8797 2.12034 31.3014 0.744964 25.438C-0.248321 21.2035 -0.248321 16.7965 0.744964 12.562Z"
                    fill="#0081C5"
                  />
                  <g mask="url(#mask0_5285_2848)">
                    <path
                      d="M10.4287 18.5001C10.4287 20.425 10.9674 22.1731 12.0448 23.7445C13.1221 25.3159 14.5505 26.4476 16.3297 27.1397C16.5108 27.2101 16.6432 27.3213 16.7271 27.4734C16.8109 27.6254 16.8127 27.7703 16.7326 27.9082C16.6376 28.0655 16.5015 28.1692 16.3242 28.2194C16.1468 28.2696 15.9728 28.2617 15.8022 28.1958C13.8151 27.4138 12.2251 26.1383 11.0319 24.3692C9.83884 22.6001 9.24229 20.6362 9.24229 18.4776C9.24229 17.8665 9.29349 17.2624 9.39589 16.6654C9.49829 16.0685 9.6593 15.4817 9.87891 14.9049L7.86221 16.0756C7.72568 16.1565 7.581 16.1767 7.42815 16.1363C7.2753 16.0958 7.15881 16.0067 7.07867 15.8689C6.99854 15.7311 6.97962 15.5839 7.02193 15.4274C7.06421 15.2708 7.15362 15.1521 7.29015 15.0712L10.5022 13.2062C10.7278 13.0804 10.9663 13.0501 11.2178 13.1152C11.4694 13.1804 11.6575 13.3268 11.7821 13.5545L13.6297 16.7677C13.7098 16.9055 13.7287 17.0527 13.6864 17.2092C13.6441 17.3658 13.5547 17.4845 13.4182 17.5654C13.2817 17.6463 13.1359 17.6653 12.9808 17.6226C12.8257 17.58 12.7081 17.4897 12.628 17.3519L11.1767 14.842C10.9199 15.4173 10.7311 16.0135 10.6102 16.6306C10.4892 17.2478 10.4287 17.8709 10.4287 18.5001ZM19.6442 9.16842C18.5965 9.16842 17.5866 9.34557 16.6147 9.69985C15.6427 10.0541 14.75 10.5608 13.9368 11.2199C13.7959 11.3308 13.6404 11.3806 13.4705 11.3693C13.3006 11.3581 13.1756 11.2836 13.0954 11.1458C12.996 10.984 12.9723 10.8136 13.0242 10.6346C13.0761 10.4556 13.1748 10.3084 13.3203 10.193C14.2329 9.47701 15.2223 8.9325 16.2886 8.5595C17.3548 8.1865 18.4637 8 19.6152 8C21.1244 8 22.5524 8.30596 23.8991 8.91788C25.2458 9.52981 26.417 10.411 27.4127 11.5614V9.1235C27.4127 8.95723 27.468 8.8183 27.5786 8.70669C27.6891 8.59509 27.8268 8.53929 27.9915 8.53929C28.1562 8.53929 28.2938 8.59509 28.4044 8.70669C28.515 8.8183 28.5702 8.95723 28.5702 9.1235V12.8535C28.5702 13.1246 28.4816 13.3497 28.3043 13.5287C28.1269 13.7077 27.9039 13.7972 27.6353 13.7972H23.9403C23.7755 13.7972 23.6379 13.7414 23.5273 13.6298C23.4168 13.5182 23.3615 13.3793 23.3615 13.213C23.3615 13.0467 23.4168 12.9078 23.5273 12.7962C23.6379 12.6846 23.7755 12.6288 23.9403 12.6288H26.8051C25.9325 11.5188 24.8692 10.6645 23.6153 10.0661C22.3613 9.46765 21.0376 9.16842 19.6442 9.16842ZM26.5513 24.6568C27.4921 23.5753 28.1454 22.3537 28.5112 20.992C28.877 19.6303 28.9264 18.25 28.6593 16.8508C28.6296 16.6696 28.6604 16.5048 28.7517 16.3565C28.8429 16.2082 28.9709 16.134 29.1356 16.134C29.33 16.134 29.491 16.2082 29.6187 16.3565C29.7463 16.5048 29.8249 16.6771 29.8546 16.8733C30.1024 18.3488 30.0334 19.8067 29.6476 21.247C29.2618 22.6873 28.5888 23.9887 27.6287 25.1511C26.8614 26.0889 25.9618 26.8656 24.9297 27.4813C23.8976 28.0969 22.7887 28.5201 21.603 28.7508L23.6064 29.9147C23.7429 29.9956 23.8312 30.1143 23.8713 30.2709C23.9113 30.4274 23.8913 30.5746 23.8111 30.7124C23.731 30.8502 23.6145 30.9393 23.4617 30.9798C23.3088 31.0202 23.1641 31 23.0276 30.9191L19.8311 29.0317C19.6056 28.9058 19.4605 28.716 19.396 28.4621C19.3314 28.2081 19.3615 27.9673 19.4861 27.7396L21.3336 24.5422C21.4138 24.4044 21.5303 24.3152 21.6831 24.2748C21.836 24.2344 21.9807 24.2546 22.1172 24.3355C22.2537 24.4164 22.3431 24.5351 22.3854 24.6916C22.4277 24.8482 22.4088 24.9953 22.3287 25.1332L20.8128 27.7374C21.9273 27.5816 22.979 27.2434 23.9681 26.7229C24.9571 26.2023 25.8182 25.5136 26.5513 24.6568Z"
                      fill="white"
                    />
                  </g>
                </svg>
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
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g mask="url(#mask0_5285_3358)">
                  <path
                    d="M4.74496 16.562C6.12034 10.6986 10.6986 6.12034 16.562 4.74496C20.7965 3.75168 25.2035 3.75168 29.438 4.74496C35.3014 6.12034 39.8797 10.6986 41.255 16.562C42.2483 20.7965 42.2483 25.2035 41.255 29.438C39.8797 35.3014 35.3014 39.8797 29.438 41.255C25.2035 42.2483 20.7965 42.2483 16.562 41.255C10.6986 39.8797 6.12034 35.3014 4.74496 29.438C3.75168 25.2035 3.75168 20.7965 4.74496 16.562Z"
                    fill="#24BEEF"
                  />
                  <path
                    d="M26.2452 29.5443C25.5875 29.5443 25.0264 29.3065 24.562 28.831C24.0976 28.3555 23.8654 27.781 23.8654 27.1076C23.8654 26.4342 24.0976 25.8597 24.562 25.3842C25.0264 24.9086 25.5875 24.6709 26.2452 24.6709C26.9029 24.6709 27.4639 24.9086 27.9284 25.3842C28.3928 25.8597 28.625 26.4342 28.625 27.1076C28.625 27.781 28.3928 28.3555 27.9284 28.831C27.4639 29.3065 26.9029 29.5443 26.2452 29.5443ZM15.8173 33C15.2995 33 14.8672 32.8224 14.5203 32.4672C14.1734 32.1121 14 31.6694 14 31.1393V16.4304C14 15.9002 14.1734 15.4575 14.5203 15.1024C14.8672 14.7472 15.2995 14.5696 15.8173 14.5696H17.8077V12.6203C17.8077 12.4416 17.865 12.2935 17.9797 12.1761C18.0943 12.0587 18.2389 12 18.4135 12C18.588 12 18.7326 12.0587 18.8472 12.1761C18.9619 12.2935 19.0192 12.4416 19.0192 12.6203V14.5696H27.0673V12.5759C27.0673 12.412 27.121 12.2751 27.2285 12.165C27.3359 12.055 27.4697 12 27.6298 12C27.7899 12 27.9237 12.055 28.0311 12.165C28.1386 12.2751 28.1923 12.412 28.1923 12.5759V14.5696H30.1827C30.7005 14.5696 31.1328 14.7472 31.4797 15.1024C31.8266 15.4575 32 15.9002 32 16.4304V31.1393C32 31.6694 31.8266 32.1121 31.4797 32.4672C31.1328 32.8224 30.7005 33 30.1827 33H15.8173ZM15.8173 31.8481H30.1827C30.3558 31.8481 30.5144 31.7743 30.6587 31.6266C30.8029 31.4789 30.875 31.3165 30.875 31.1393V21.038H15.125V31.1393C15.125 31.3165 15.1971 31.4789 15.3413 31.6266C15.4856 31.7743 15.6442 31.8481 15.8173 31.8481ZM15.125 19.8861H30.875V16.4304C30.875 16.2532 30.8029 16.0907 30.6587 15.943C30.5144 15.7954 30.3558 15.7215 30.1827 15.7215H15.8173C15.6442 15.7215 15.4856 15.7954 15.3413 15.943C15.1971 16.0907 15.125 16.2532 15.125 16.4304V19.8861Z"
                    fill="white"
                  />
                </g>
              </svg>
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
                onClick={() => navigate("/send/recurring-payment")}
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
          </div>
        </div>
      </form>
    </>
  );
}

export default SendRecurringPayment;
