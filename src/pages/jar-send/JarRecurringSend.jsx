import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import InputNumber from "components/ui/InputNumber";
import { LoaderContext } from "context/loaderContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import InputDatePicker from "components/ui/InputDatePicker";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { useSelector } from "react-redux";
import ModalDatePickerKyc from "components/modals/ModalDatePickerKyc";
import { LoginContext } from "context/loginContext";
import {
  CURRENCY_SYMBOL,
  handleWholeNumberInputBlur,
  handleWholeNumberInputChange,
  isAdminApprovedWithRenewCheck,
} from "constants/all";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { jarRecurringSchema } from "schemas/jarSchema";
import Input from "components/ui/Input";
import { apiRequest } from "helpers/apiRequests";

function JarRecurringSend() {
  const { setIsLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
  const [activeDatePicker, setActiveDatePicker] = useState("");
  const [activeButton, setActiveButton] = useState("recurring_end_date");
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [occurrenceCount, setOccurrenceCount] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [showScheduleConfirmPopup, setShowScheduleConfirmPopup] =
    useState(false);

  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
  const {
    sendCreds,
    prevPathRedirect,
    cancelOwnJarPayment,
    handleRecurringSendPaymentForDate,
    handleRecurringPaymentForAddAmountToPayForDate,
    handleRecurringPaymentForAddedMember,
    addJarMembers,
  } = useContext(SavingJarOwnContext);
  const { wallet } = sendCreds || [];
  const myInputRef = useRef(null);

  useEffect(() => {
    const preventPageScroll = (e) => {
      if (document.activeElement === myInputRef.current) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", preventPageScroll, { passive: false });

    return () => {
      document.removeEventListener("wheel", preventPageScroll);
    };
  }, []);

  const handleChangeDateFilter = (date) => {
    if (activeDatePicker === "start") {
      formik.setFieldValue("recurring_start_date", date);
      setStartDate(date);
      formik.setFieldValue("recurring_end_date", "");
    } else if (activeDatePicker === "end") {
      formik.setFieldValue("recurring_end_date", date);
    }
    setActiveDatePicker("");
  };

  const handleOccurrenceButtonClick = (e) => {
    e.preventDefault();
    setActiveButton("occurrences");
    formik.setFieldValue("recurring_end_date", "");
  };

  const handleFrequencyClick = (frequency) => {
    setSelectedFrequency(frequency);
    formik.setFieldValue("frequency", frequency);
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleScheduleSubmit = async () => {
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      return;
    }

    // Extract the date part only (to avoid time comparison)
    const today = new Date();
    const todayDateStr = formatDate(today);
    const startDateObj = new Date(formik.values.recurring_start_date);
    const startDateStr = formatDate(startDateObj);

    // Check if recurring_start_date is equal to the current date
    if (startDateStr === todayDateStr) {
      setShowScheduleConfirmPopup(true); // Show the popup otherwise
    } else {
      handleConfirmRecurringSubmit(); // Directly execute the handleConfirmRecurringSubmit if recurring_start_date is today
    }
  };

  const formik = useFormik({
    initialValues: {
      recurring_start_date: "",
      recurring_end_date: "",
      frequency: "daily",
      total_amount: "",
      specifications: "",
    },
    validationSchema: jarRecurringSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    context: { activeButton },
    validate: (values) => {
      let errors = {};
      if (activeButton === "recurring_end_date" && !values.recurring_end_date) {
        errors.recurring_end_date = "End date is required";
      }
      if (values.recurring_start_date && values.recurring_end_date) {
        const startDate = new Date(values.recurring_start_date);
        const endDate = new Date(values.recurring_end_date);
        const timeDiff = endDate - startDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        switch (values.frequency) {
          case "daily":
            if (daysDiff < 1) {
              errors.recurring_end_date =
                "For daily frequency, end date should be at least 1 day after start date.";
            }
            break;
          case "weekly":
            if (daysDiff < 7) {
              errors.recurring_end_date =
                "For weekly frequency, end date should be at least 7 days after start date.";
            }
            break;
          case "monthly":
            if (daysDiff < 28) {
              // or 30 if you prefer
              errors.recurring_end_date =
                "For monthly frequency, end date should be at least 28 days after start date.";
            }
            break;
          case "yearly":
            if (daysDiff < 365) {
              errors.recurring_end_date =
                "For yearly frequency, end date should be at least 365 days after start date.";
            }
            break;
          default:
            break;
        }
      }
      return errors;
    },
  });

  const parseTargetDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleConfirmRecurringSubmit = async () => {
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await apiRequest.generateOccurrenceForSavingJar({
        ...formik.values,
        recurring_start_date: parseTargetDate(
          formik.values.recurring_start_date
        ),
        recurring_end_date: parseTargetDate(formik.values.recurring_end_date),
        schedule_date: new Date().toISOString().split("T")[0],
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
      if (wallet.isMember && wallet.jar_id) {
        handleRecurringPaymentForAddedMember({
          ...wallet,
          ...data.data,
          specifications: formik.values.specifications,
        });
      } else if (wallet.jar_id) {
        handleRecurringPaymentForAddAmountToPayForDate({
          ...data.data,
          specifications: formik.values.specifications,
        });
      } else {
        handleRecurringSendPaymentForDate({
          ...data.data,
          specifications: formik.values.specifications,
        });
      }
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
      const errorObj = {};
      for (const property in error) errorObj[property] = error[property]?.[0];
      formik.setErrors(errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJarMembers = async () => {
    if (addJarMembers) await addJarMembers(wallet.jar_id, wallet.members);
    if (wallet.jar_id && wallet?.members?.length > 0) return navigate(-1);
    cancelOwnJarPayment();
  };

  const handleCancel = () => {
    if (wallet.jar_id && wallet?.members?.length > 0) return navigate(-1);
    if (wallet.jar_id) return navigate("/jars/own", { replace: true });
    navigate("/jars/own/create-jar", { replace: true });
    cancelOwnJarPayment();
  };

  useEffect(() => {
    formik.validateForm();
  }, [activeButton]);

  useEffect(() => {
    // Check if the wallet array is empty and navigate accordingly
    if (!sendCreds?.wallet || sendCreds.wallet.length <= 0) {
      navigate(prevPathRedirect || "/jars/own", { replace: true });
    }
  }, [sendCreds, navigate, prevPathRedirect]);

  return (
    <>
      <div className="settings-inner-sec wallet-ac-is">
        {/* <div className="profile-info"> */}
        <h3>Recurring Schedule Payment</h3>
        <ul className="breadcrumb">
          <li>
            <span className="cursor-pointer" onClick={handleCancel}>
              Sub-accounts
            </span>
          </li>
          <li>Recurring Send</li>
        </ul>
        {/* </div> */}
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="bg-white-A700 flex flex-col font-visbyroundcf items-center justify-end mx-auto md:pr-10 pr-11 sm:pr-5 w-full">
              <div className="flex md:flex-col flex-row md:gap-10 items-start justify-between mx-auto w-full">
                <div className="flex md:flex-1 md:flex-col flex-row md:gap-5 items-start justify-evenly w-[79%] md:w-full">
                  <div className="flex flex-1 flex-col justify-start md:mt-0 mt-[174px] w-full">
                    <div className="flex flex-col items-start justify-start md:ml-[0] ml-[309px] w-[63%] md:w-full">
                      <div className="row mt-3">
                        <div className="col-12 p-0 amt-with-currency">
                          <span>{CURRENCY_SYMBOL}</span>
                          <Input
                            id="total_amount"
                            type="text"
                            inputMode="decimal"
                            className="form-control"
                            name="total_amount"
                            // maxLength="6"
                            placeholder="Amount"
                            onChange={(e) =>
                              handleWholeNumberInputChange(
                                e,
                                formik.setFieldValue,
                                "total_amount"
                              )
                            }
                            onBlur={(e) =>
                              handleWholeNumberInputBlur(
                                e,
                                formik.setFieldValue,
                                formik.handleBlur,
                                "total_amount"
                              )
                            }
                            value={formik.values.total_amount}
                            error={
                              formik.touched.total_amount &&
                              formik.errors.total_amount
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 p-0">
                          <Input
                            type="text"
                            id="cc_specification"
                            className="form-control"
                            placeholder="Specification"
                            name="specifications"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.specifications}
                            error={
                              formik.touched.specifications &&
                              formik.errors.specifications
                            }
                          />
                        </div>
                      </div>
                      <div
                        className="common-dr-picker"
                        style={{ marginBottom: "15px" }}
                      >
                        <label className="rec-label-class">Start Date</label>
                        <InputDatePicker
                          className="date-filter-calendar-recurring"
                          date={formik.values.recurring_start_date}
                          onClick={() => {
                            setActiveDatePicker("start");
                          }}
                        />
                        {formik.touched.recurring_start_date &&
                        formik.errors.recurring_start_date ? (
                          <p className="text-danger pb-0">
                            {formik.errors.recurring_start_date}
                          </p>
                        ) : null}
                      </div>

                      <label className="rec-label-class">Frequency</label>
                      <div className="frequency-buttons mb-0">
                        {["daily", "weekly", "monthly", "yearly"].map(
                          (freq) => (
                            <button
                              key={freq}
                              type="button"
                              className={`btn ${
                                selectedFrequency === freq
                                  ? "btn-freqActive"
                                  : "btn-freqInactive"
                              }`}
                              onClick={() => handleFrequencyClick(freq)}
                            >
                              {freq.charAt(0).toUpperCase() + freq.slice(1)}
                            </button>
                          )
                        )}
                      </div>

                      {activeButton === "recurring_end_date" && (
                        <div
                          className="common-dr-picker"
                          style={{ marginBottom: "15px", marginTop: "15px" }}
                        >
                          <label className="rec-label-class">End Date</label>
                          <InputDatePicker
                            className="date-filter-calendar-recurring"
                            date={formik.values.recurring_end_date}
                            onClick={() => {
                              setActiveDatePicker("end");
                            }}
                          />
                          {formik.touched.recurring_end_date &&
                          formik.errors.recurring_end_date ? (
                            <p className="text-danger pb-0">
                              {formik.errors.recurring_end_date}
                            </p>
                          ) : null}
                        </div>
                      )}

                      {adminApprovedWithRenewCheck ? (
                        <div className="pay-btn-wrap flex-nowrap">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-cancel-payment w-100"
                          >
                            Cancel
                          </button>
                          {wallet?.members?.length > 0 && wallet.isMember && (
                            <button
                              type="button"
                              onClick={handleAddJarMembers}
                              className="btn btn-cancel-payment w-100"
                            >
                              Skip
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-send-payment w-100 m-0"
                            disabled={formik.isSubmitting}
                            onClick={handleScheduleSubmit}
                          >
                            Continue
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <ModalDatePickerKyc
          minDate={activeDatePicker === "start" ? new Date() : startDate}
          show={activeDatePicker !== ""}
          setShow={() => setActiveDatePicker("")}
          classNameChild={"schedule-time-modal"}
          heading="Date Filter"
          handleChangeDate={handleChangeDateFilter}
          // maxDate={
          //   wallet.target_date ? parseTargetDate(wallet.target_date) : null
          // }
        />
        <ModalConfirmation
          id="delete-group-member-popup"
          show={showScheduleConfirmPopup}
          setShow={setShowScheduleConfirmPopup}
          heading={"Are you sure want to schedule this recurring payment?"}
          subHeading={
            "From selected current date, your recurring schedule payment will be executed now."
          }
          handleCallback={handleConfirmRecurringSubmit}
        />
      </div>
    </>
  );
}

export default JarRecurringSend;
